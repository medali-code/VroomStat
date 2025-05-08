import { IsOptional, IsString, IsInt, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVehiculeDto {
  @ApiPropertyOptional({ description: 'Vehicle brand' })
  @IsOptional()
  @IsString()
  marque?: string;

  @ApiPropertyOptional({ description: 'Vehicle model' })
  @IsOptional()
  @IsString()
  modele?: string;

  @ApiPropertyOptional({ description: 'Vehicle registration number' })
  @IsOptional()
  @IsString()
  immatriculation?: string;

  @ApiPropertyOptional({ description: 'Vehicle color' })
  @IsOptional()
  @IsString()
  couleur?: string;

  @ApiPropertyOptional({ description: 'Vehicle year of manufacture' })
  @IsOptional()
  @IsInt()
  annee?: number;
}
