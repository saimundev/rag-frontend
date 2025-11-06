import { Module } from '@nestjs/common';
import { PointTableService } from './point-table.service';
import { PointTableController } from './point-table.controller';

@Module({
  controllers: [PointTableController],
  providers: [PointTableService],
})
export class PointTableModule {}
