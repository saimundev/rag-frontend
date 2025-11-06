import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVenueDto, venueSchema } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseAndValidate } from 'src/utils/parse-and-validate.util';
import { successResponse } from 'src/utils/success-response.util';

@Injectable()
export class VenueService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createVenueDto: CreateVenueDto) {
    const parsedData = parseAndValidate(venueSchema, createVenueDto);
    const venue = await this.prisma.venue.create({
      data: parsedData,
    });
    return successResponse(venue, 'Venue created successfully', 201);
  }

  async findAll() {
    const venues = await this.prisma.venue.findMany({
      include: {
        match: true,
        tournament: true,
      },
    });
    return successResponse(venues, 'Venues retrieved successfully');
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Venue ID is required');
    }
    const venue = await this.prisma.venue.findUnique({
      where: {
        id: id,
      },
      include: {
        match: true,
        tournament: true,
      },
    });
    return successResponse(venue, 'Venue retrieved successfully');
  }

  update(id: number, updateVenueDto: UpdateVenueDto) {
    return `This action updates a #${id} venue`;
  }

  remove(id: number) {
    return `This action removes a #${id} venue`;
  }
}
