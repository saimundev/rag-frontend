import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const startInningSchema = z.object({
  matchId: z.number().int(),
  inningNumber: z.number().int().min(1).max(2),
  battingTeamId: z.number().int(),
  bowlingTeamId: z.number().int(),
  strikerId: z.number().int().optional(),
  nonStrikerId: z.number().int().optional(),
  bowlerId: z.number().int().optional(),
});

// ball event
export const ballEventSchema = z.object({
  inningId: z.number().int(),
  overNumber: z.number().int().min(0),
  ballNumber: z.number().int().min(0).max(6),
  runs: z.number().int().min(0),
  extras: z.number().int().min(0).optional().default(0),
  isWicket: z.boolean().optional().default(false),
  wicketInfo: z.any().optional(),
  batsmanId: z.number().int().optional(),
  bowlerId: z.number().int().optional(),
  remark: z.string().optional(),
});

// change striker
export const changeStrikerSchema = z.object({
  inningId: z.number().int(),
  newStrikerId: z.number().int(),
  newNonStrikerId: z.number().int().optional(),
});

// change bowler
export const changeBowlerSchema = z.object({
  inningId: z.number().int(),
  newBowlerId: z.number().int(),
});

// get state
export const getStateSchema = z.object({
  matchId: z.coerce.number().int(),
});

export class CreateScoreInningDto extends createZodDto(startInningSchema) {}
export class CreateBallDto extends createZodDto(ballEventSchema) {}
export class ChangeStrikerDto extends createZodDto(changeStrikerSchema) {}
export class ChangeBowlerDto extends createZodDto(changeBowlerSchema) {}
export class GetStateDto extends createZodDto(getStateSchema) {}
