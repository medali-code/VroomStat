// avis.controller.ts
import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { AvisService } from './avis.service';
import { CreateAvisDto } from './dto/create-avis.dto';
import { Avis } from './entities/avis.entity';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAviDto } from './dto/update-avis.dto'; // Importez le nouveau DTO

@ApiTags('avis')
@Controller('avis')
export class AvisController {
  constructor(private readonly avisService: AvisService) {}

  @Post()
  async create(@Body() createAvisDto: CreateAvisDto): Promise<Avis> {
    return this.avisService.createAvis(createAvisDto);
  }

  @Get()
  async findAll(): Promise<Avis[]> {
    return this.avisService.getAvis();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Avis> {
    return this.avisService.getAvisById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAvisDto: UpdateAviDto, // Utilisez le nouveau DTO
  ): Promise<Avis> {
    return this.avisService.updateAvis(id, updateAvisDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.avisService.deleteAvis(id);
  }
}