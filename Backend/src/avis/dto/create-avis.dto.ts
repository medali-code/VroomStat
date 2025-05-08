import { IsNotEmpty, IsString, IsInt, Min, Max, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AvisStatus } from '../entities/avis.entity';

export class CreateAvisDto {
  @ApiProperty({ required: true, description: 'Rating from 1 to 5' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  note: number;

  @ApiProperty({ required: true, description: 'Comment for the review' })
  @IsNotEmpty()
  @IsString()
  commentaire: string;



  @ApiProperty({ required: true, description: 'ID of the client' })
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @ApiProperty({ enum: AvisStatus, description: 'Status of the review', default: AvisStatus.PENDING, required: false })
  @IsOptional()
  @IsEnum(AvisStatus)
  statut?: AvisStatus;
}
