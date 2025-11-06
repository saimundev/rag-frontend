import { Injectable, BadRequestException } from '@nestjs/common';

import {
  ballEventSchema,
  ChangeBowlerDto,
  ChangeStrikerDto,
  CreateBallDto,
  CreateScoreInningDto,
  GetStateDto,
  getStateSchema,
  startInningSchema,
} from './dto/create-score.dto';
import { parseAndValidate } from 'src/utils/parse-and-validate.util';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScoreService {
  constructor(private prisma: PrismaService) {}

  // start an inning
  async startInning(payload: CreateScoreInningDto) {
    const parsed = parseAndValidate(startInningSchema, payload);

    // create inning
    const inning = await this.prisma.inning.create({
      data: {
        matchId: parsed.matchId,
        inningNumber: parsed.inningNumber,
        battingTeamId: parsed.battingTeamId,
        bowlingTeamId: parsed.bowlingTeamId,
        isPowerPlay: false,
      },
    });

    // optionally create initial BatsmanStats & BowlerStats records for quick reference
    const ops: any[] = [];
    if (parsed.strikerId) {
      ops.push(
        this.prisma.batsmanStats.create({
          data: {
            playerId: parsed.strikerId,
            inningId: inning.id,
            isOnStrike: true,
          },
        }),
      );
    }
    if (parsed.nonStrikerId) {
      ops.push(
        this.prisma.batsmanStats.create({
          data: {
            playerId: parsed.nonStrikerId,
            inningId: inning.id,
            isOnStrike: false,
          },
        }),
      );
    }
    if (parsed.bowlerId) {
      ops.push(
        this.prisma.bowlerStats.create({
          data: {
            playerId: parsed.bowlerId,
            inningId: inning.id,
          },
        }),
      );
    }

    if (ops.length) await this.prisma.$transaction(ops);
    return inning;
  }

  // process a ball event
  async postBallEvent(payload: CreateBallDto) {
    const parsed = parseAndValidate(ballEventSchema, payload);

    // idempotency: if eventId provided we might store and check / skip duplicates (not implemented here)
    // begin transaction
    const res = await this.prisma.$transaction(async (prisma) => {
      // 1) create Ball row
      const ball = await prisma.ball.create({
        data: {
          inningId: parsed.inningId,
          overNumber: parsed.overNumber,
          ballNumber: parsed.ballNumber,
          runs: parsed.runs,
          extras: parsed.extras ?? 0,
          isWicket: parsed.isWicket ?? false,
          wicketInfo: parsed.wicketInfo ? parsed.wicketInfo : null,
          batsmanId: parsed.batsmanId ?? null,
          bowlerId: parsed.bowlerId ?? null,
          remark: parsed.remark ?? null,
        },
      });

      // 2) update inning totals
      const inning = await prisma.inning.findUnique({
        where: { id: parsed.inningId },
      });
      if (!inning) throw new BadRequestException('Inning not found');

      const newRuns = inning.runs + parsed.runs + (parsed.extras ?? 0);
      const newWickets = inning.wickets + (parsed.isWicket ? 1 : 0);

      // compute overs in decimal: convert using balls count (we'll increment using ballNumber and overNumber)
      // For simplicity we update overs = overNumber + ballNumber/10 (store as float)
      // Better approach: track totalBalls in DB — but we follow current schema where overs Float exists.
      const oversDecimal =
        parsed.overNumber + Number((parsed.ballNumber / 10).toFixed(2));

      await prisma.inning.update({
        where: { id: parsed.inningId },
        data: {
          runs: newRuns,
          wickets: newWickets,
          overs: oversDecimal,
        },
      });

      // 3) update batsman stats (if batsmanId provided)
      if (parsed.batsmanId) {
        const bs = await prisma.batsmanStats.findFirst({
          where: { inningId: parsed.inningId, playerId: parsed.batsmanId },
        });
        if (bs) {
          await prisma.batsmanStats.update({
            where: { id: bs.id },
            data: {
              runs: { increment: parsed.runs },
              ballsFaced: { increment: parsed.extras ? 0 : 1 }, // extras not count to batsman ball if wide
              // totalFours / totalSixes detection omitted; you'd pass that info in payload if needed
              isOnStrike: true,
              isOut: parsed.isWicket ? true : bs.isOut,
            },
          });
        } else {
          await prisma.batsmanStats.create({
            data: {
              playerId: parsed.batsmanId,
              inningId: parsed.inningId,
              runs: parsed.runs,
              ballsFaced: parsed.extras ? 0 : 1,
              isOnStrike: true,
              isOut: parsed.isWicket ?? false,
            },
          });
        }
      }

      // 4) update bowler stats
      if (parsed.bowlerId) {
        const bw = await prisma.bowlerStats.findFirst({
          where: { inningId: parsed.inningId, playerId: parsed.bowlerId },
        });
        const ballLegal = !(
          parsed.extras &&
          parsed.extras > 0 &&
          parsed.runs === 0 &&
          !parsed.isWicket
        ); // simplification
        if (bw) {
          await prisma.bowlerStats.update({
            where: { id: bw.id },
            data: {
              runsGiven: { increment: parsed.runs + (parsed.extras ?? 0) },
              wicketsTaken: { increment: parsed.isWicket ? 1 : 0 },
              // oversBowled naive increment: add 0.1 for a legal ball
              oversBowled: { increment: ballLegal ? 0.1 : 0 },
            },
          });
        } else {
          await prisma.bowlerStats.create({
            data: {
              playerId: parsed.bowlerId,
              inningId: parsed.inningId,
              runsGiven: parsed.runs + (parsed.extras ?? 0),
              wicketsTaken: parsed.isWicket ? 1 : 0,
              oversBowled: ballLegal ? 0.1 : 0,
            },
          });
        }
      }

      // 5) return summary
      const updatedInning = await prisma.inning.findUnique({
        where: { id: payload.inningId },
        include: {
          batsmenStats: true,
          bowlerStats: true,
          balls: true,
        },
      });

      return { ball, inning: updatedInning };
    }); // end transaction

    return res;
  }

  // fetch match state: include innings, balls, stats
  async getMatchState(matchId: GetStateDto) {
    console.log('match id', matchId);
    const parsed = parseAndValidate(getStateSchema, { matchId });
    // console.log("parsed data",parsed)
    const innings = await this.prisma.inning.findMany({
      where: { matchId: parsed.matchId },
      include: {
        batsmenStats: { include: { player: true } },
        bowlerStats: { include: { player: true } },
        balls: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { inningNumber: 'asc' },
    });

    return innings;
  }

  // change striker
  async changeStriker(payload: ChangeStrikerDto) {
    // set all isOnStrike false then set new true
    await this.prisma.$transaction([
      this.prisma.batsmanStats.updateMany({
        where: { inningId: payload.inningId },
        data: { isOnStrike: false },
      }),
      this.prisma.batsmanStats.updateMany({
        where: { inningId: payload.inningId, playerId: payload.newStrikerId },
        data: { isOnStrike: true },
      }),
    ]);

    return { success: true };
  }

  // change bowler
  async changeBowler(payload: ChangeBowlerDto) {
    // create or ensure bowlerStats exists
    const existing = await this.prisma.bowlerStats.findFirst({
      where: { inningId: payload.inningId, playerId: payload.newBowlerId },
    });
    if (!existing) {
      await this.prisma.bowlerStats.create({
        data: { inningId: payload.inningId, playerId: payload.newBowlerId },
      });
    }
    return { success: true };
  }
}
