import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTeamDto, teamSchema } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { parseAndValidate } from 'src/utils/parse-and-validate.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { successResponse } from 'src/utils/success-response.util';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createTeamDto: CreateTeamDto) {
    const parsedData = parseAndValidate(teamSchema, createTeamDto);

    const team = await this.prisma.team.create({
      data: parsedData,
    });

    return successResponse(team, 'Team created successfully', 201);
  }

  async findAll() {
    const teams = await this.prisma.team.findMany({
      include: {
        player: true,
        tournament: true,
        pointTable: true,
        matchesAsTeamA: true,
        matchesAsTeamB: true,
      },
    });
    return successResponse(teams, 'Teams retrieved successfully');
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Team ID is required');
    }
    const team = await this.prisma.team.findUnique({
      where: {
        id: id,
      },
      include: {
        player: true,
        tournament: true,
        pointTable: true,
        matchesAsTeamA: true,
        matchesAsTeamB: true,
      },
    });
    return successResponse(team, 'Team retrieved successfully');
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
