import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMatchDto, matchSchema } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseAndValidate } from 'src/utils/parse-and-validate.util';
import { successResponse } from 'src/utils/success-response.util';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createMatchDto: CreateMatchDto) {
    const parsedData = parseAndValidate(matchSchema, createMatchDto);
    const match = await this.prisma.match.create({
      data: parsedData,
    });
    return successResponse(match, 'Match created successfully', 201);
  }

  async findAll() {
    const matches = await this.prisma.match.findMany({
      include: {
        teamA: true,
        teamB: true,
        tournament: true,
        venue: true,
      },
    });

    return successResponse(matches, 'Matches retrieved successfully', 201);
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Match ID is required');
    }
    const match = await this.prisma.match.findUnique({
      where: {
        id: id,
      },
      include: {
        teamA: true,
        teamB: true,
        tournament: true,
        venue: true,
      },
    });
    return successResponse(match, 'Match retrieved successfully');
  }

  update(id: number, updateMatchDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
