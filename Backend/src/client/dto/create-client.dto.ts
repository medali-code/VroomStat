import { IsNotEmpty, IsString, IsEmail, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/Role.enum';

export class CreateClientDto {
  @ApiProperty({ example: 'Dupont' })
  @IsNotEmpty() @IsString()
  nom: string;

  @ApiProperty({ example: 'Jean' })
  @IsNotEmpty() @IsString()
  prenom: string;

  @ApiProperty({ example: 'jean.dupont@example.com' })
  @IsNotEmpty() @IsEmail()
  email: string;

  @ApiProperty({ example: 'MotDePasse123' })
  @IsNotEmpty() @IsString()
  motDePasse: string;

  @ApiProperty({ example: '123 Rue Exemple, Paris' })
  @IsNotEmpty() @IsString()
  adresse: string;

  @ApiProperty({ example: 33612345678 })
  @IsNotEmpty() @IsNumber()
  telephone: number;

  @ApiProperty({ enum: Role, required: false })
  @IsOptional() @IsEnum(Role)
  role?: Role;

  @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
  @IsOptional() @IsString()
  photoProfil?: string;
}