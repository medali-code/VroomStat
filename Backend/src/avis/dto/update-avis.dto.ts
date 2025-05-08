import { PartialType } from '@nestjs/mapped-types';
import { CreateAvisDto } from './create-avis.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { AvisStatus } from '../entities/avis.entity';

export class UpdateAviDto extends PartialType(CreateAvisDto) {
    @ApiProperty({ enum: AvisStatus, description: 'Status of the review', required: false })
    @IsOptional()
    @IsEnum(AvisStatus)
    statut?: AvisStatus;
}
