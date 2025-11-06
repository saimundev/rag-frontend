import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateTournamentDto,
  tournamentSchema,
} from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { successResponse } from 'src/utils/success-response.util';
import { parseAndValidate } from 'src/utils/parse-and-validate.util';

@Injectable()
export class TournamentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createTournamentDto: CreateTournamentDto) {
    const validatedData = parseAndValidate(
      tournamentSchema,
      createTournamentDto,
    );

    const tournament = await this.prisma.tournament.create({
      data: validatedData,
    });

    return successResponse(tournament, 'Tournament created successfully', 201);
  }

  async findAll() {
    const tournaments = await this.prisma.tournament.findMany({
      include: {
        match: true,
        team: true,
        pointTable: true,
        venue: true,
      },
    });
    return successResponse(tournaments, 'Tournaments retrieved successfully');
  }

  findOne(id: number) {
    return `This action returns a #${id} tournament`;
  }

  update(id: number, updateTournamentDto: UpdateTournamentDto) {
    return `This action updates a #${id} tournament`;
  }

  remove(id: number) {
    return `This action removes a #${id} tournament`;
  }
}
