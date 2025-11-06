import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreatePointTableDto,
  pointTableSchema,
} from './dto/create-point-table.dto';
import { UpdatePointTableDto } from './dto/update-point-table.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseAndValidate } from 'src/utils/parse-and-validate.util';
import { successResponse } from 'src/utils/success-response.util';

@Injectable()
export class PointTableService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPointTableDto: CreatePointTableDto) {
    const parsedData = parseAndValidate(pointTableSchema, createPointTableDto);
    const pointTable = await this.prisma.pointTable.create({
      data: parsedData,
    });
    return successResponse(pointTable, 'PointTable created successfully', 201);
  }

  async findAll() {
    const pointTables = await this.prisma.pointTable.findMany({
      include: {
        team: true,
        tournament: true,
      },
    });

    return successResponse(
      pointTables,
      'PointTables retrieved successfully',
      201,
    );
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('PointTable ID is required');
    }
    const pointTable = await this.prisma.pointTable.findUnique({
      where: {
        id: id,
      },
      include: {
        team: true,
        tournament: true,
      },
    });
    return successResponse(pointTable, 'PointTable retrieved successfully');
  }

  update(id: number, updatePointTableDto: UpdatePointTableDto) {
    return `This action updates a #${id} pointTable`;
  }

  remove(id: number) {
    return `This action removes a #${id} pointTable`;
  }
}
