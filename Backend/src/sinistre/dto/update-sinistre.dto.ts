import { PartialType } from '@nestjs/mapped-types';
import { CreateSinistreDto } from './create-sinistre.dto';

export class UpdateSinistreDto extends PartialType(CreateSinistreDto) {}
