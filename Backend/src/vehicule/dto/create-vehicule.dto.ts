import { IsNotEmpty, IsString, IsInt, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehiculeDto {
  @ApiProperty({ required: true, description: 'Vehicle brand' })
  @IsNotEmpty()
  @IsString()
  marque: string;

  @ApiProperty({ required: true, description: 'Vehicle model' })
  @IsNotEmpty()
  @IsString()
  modele: string;

  @ApiProperty({ required: true, description: 'Vehicle registration number' })
  @IsNotEmpty()
  @IsString()
  immatriculation: string;

  @ApiProperty({ required: true, description: 'Vehicle color' })
  @IsNotEmpty()
  @IsString()
  couleur: string;

  @ApiProperty({ required: true, description: 'Vehicle year of manufacture' })
  @IsNotEmpty()
  @IsInt()
  annee: number;

  @ApiProperty({ required: true, description: 'ID of the owner (Client)' })
  @IsNotEmpty()
  @IsString()
  proprietaireId: string;
}
