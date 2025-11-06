import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlayerDto, playerSchema } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { parseAndValidate } from 'src/utils/parse-and-validate.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { successResponse } from 'src/utils/success-response.util';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPlayerDto: CreatePlayerDto) {
    const parsedData = parseAndValidate(playerSchema, createPlayerDto);
    const player = await this.prisma.player.create({
      data: parsedData,
    });
    return successResponse(player, 'Player created successfully', 201);
  }

  async findAll() {
    const players = await this.prisma.player.findMany({
      include: {
        team: true,
      },
    });

    return successResponse(players, 'Players retrieved successfully', 201);
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Player ID is required');
    }
    const player = await this.prisma.player.findUnique({
      where: {
        id: id,
      },
      include: {
        team: true,
      },
    });
    return successResponse(player, 'Player retrieved successfully');
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  remove(id: number) {
    return `This action removes a #${id} player`;
  }
}
