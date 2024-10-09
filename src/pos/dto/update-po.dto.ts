import { PartialType } from '@nestjs/mapped-types';
import { CreatePoDto } from './create-po.dto';
import { IsInt } from 'class-validator';

export class UpdatePoDto extends PartialType(CreatePoDto) {
    @IsInt()
    paidAmount: number;
}
