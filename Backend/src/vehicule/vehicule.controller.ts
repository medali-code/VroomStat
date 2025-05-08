import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { Vehicule } from './entities/vehicule.entity';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('vehicules')
@Controller('vehicules')
export class VehiculeController {
  constructor(private readonly vehiculeService: VehiculeService) {}

  @Post()
  async create(@Body() createVehiculeDto: CreateVehiculeDto): Promise<Vehicule> {
    return this.vehiculeService.createVehicule(createVehiculeDto);
  }

  @Get()
  async findAll(): Promise<Vehicule[]> {
    return this.vehiculeService.getVehicules();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Vehicule> {
    return this.vehiculeService.getVehiculeById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehiculeDto: Partial<CreateVehiculeDto>,
  ): Promise<Vehicule> {
    return this.vehiculeService.updateVehicule(id, updateVehiculeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.vehiculeService.deleteVehicule(id);
  }
  @Get('user/:userId')
async getVehiculesByUserId(@Param('userId') userId: string) {
  return this.vehiculeService.getVehiculesByUserId(userId);
}
}
