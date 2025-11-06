import { PartialType } from '@nestjs/swagger';
import { CreatePointTableDto } from './create-point-table.dto';

export class UpdatePointTableDto extends PartialType(CreatePointTableDto) {}
