import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PointTableService } from './point-table.service';
import { CreatePointTableDto } from './dto/create-point-table.dto';
import { UpdatePointTableDto } from './dto/update-point-table.dto';

@Controller('point-table')
export class PointTableController {
  constructor(private readonly pointTableService: PointTableService) {}

  @Post()
  create(@Body() createPointTableDto: CreatePointTableDto) {
    return this.pointTableService.create(createPointTableDto);
  }

  @Get()
  findAll() {
    return this.pointTableService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pointTableService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePointTableDto: UpdatePointTableDto) {
    return this.pointTableService.update(+id, updatePointTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointTableService.remove(+id);
  }
}
