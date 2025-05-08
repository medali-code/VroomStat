import { IsNotEmpty, IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SinistreStatut, PieceType } from '../entities/sinistre.entity';

export class CreateSinistreDto {
  @ApiProperty({ description: 'Date de déclaration (ISO)', example: '2025-04-19T15:30:00Z' })
  @IsNotEmpty() @IsDateString()
  dateDeclaration: string;

  @ApiProperty({ description: 'Lieu du sinistre', example: 'Tunis' })
  @IsNotEmpty() @IsString()
  lieu: string;

  @ApiProperty({ description: 'Description détaillée' })
  @IsNotEmpty() @IsString()
  commentaire: string;

 
  @ApiProperty({ description: 'Type de pièce endommagée', enum: PieceType })
  @IsNotEmpty() @IsEnum(PieceType)
  type: PieceType;

  @ApiProperty({ description: 'Statut du sinistre', enum: SinistreStatut, required: false, default: SinistreStatut.EN_ATTENTE })
  @IsOptional() @IsEnum(SinistreStatut)
  statut?: SinistreStatut;

  @ApiProperty({ description: 'ID du client' })
  @IsNotEmpty() @IsString()
  clientId: string;

  @ApiProperty({ description: 'ID du véhicule' })
  @IsNotEmpty() @IsString()
  vehiculeId: string;

  @ApiProperty({ description: 'URL ou chemins des images', required: false })
  @IsOptional() @IsString()
  images?: string[];


  @ApiProperty({ description: 'numeroAssurence', required: false })
  @IsOptional() @IsString()
    numeroAssurence: string;
    @ApiProperty({ description: 'nomAdversaire', required: false })
    @IsOptional() @IsString()
    nomAdversaire: string;
    @ApiProperty({ description: 'prenomAdversaire', required: false })
    @IsOptional() @IsString()
    prenomAdversaire: string;
    @ApiProperty({ description: 'numeroAssurenceAdversaire', required: false })
    @IsOptional() @IsString()
    numeroAssurenceAdversaire: string;
    @ApiProperty({ description: 'matriculeAdvr', required: false })
    @IsOptional() @IsString()
    matriculeAdvr: string;
    @ApiProperty({ description: 'marqueVoitureAdvr', required: false })
    @IsOptional() @IsString()
    marqueVoitureAdvr: string;
    @ApiProperty({ description: 'agenceAdvr', required: false })
    @IsOptional() @IsString()
    agenceAdvr: string;
    @ApiProperty({ description: 'agenceClient', required: false })
    @IsOptional() @IsString()
    agenceClient: string;
  
}
