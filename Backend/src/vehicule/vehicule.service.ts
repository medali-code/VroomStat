import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { Client } from '../client/entities/client.entity';

@Injectable()
export class VehiculeService {
  constructor(
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async createVehicule(createVehiculeDto: CreateVehiculeDto): Promise<Vehicule> {
    const { proprietaireId, ...vehiculeData } = createVehiculeDto;

    // Recherche du client correspondant
    const client = await this.clientRepository.findOne({ where: { id: proprietaireId } });
    if (!client) {
      throw new NotFoundException(`Client with id ${proprietaireId} not found`);
    }

    // Création et enregistrement du véhicule
    const vehicule = this.vehiculeRepository.create({
      ...vehiculeData,
      annee: createVehiculeDto.annee,
      proprietaire: client,
    });

    return await this.vehiculeRepository.save(vehicule);
  }

  async getVehicules(): Promise<Vehicule[]> {
    return await this.vehiculeRepository.find({ 
      relations: ['proprietaire'],
    });
  }

  async getVehiculeById(id: string): Promise<Vehicule> {
    const vehicule = await this.vehiculeRepository.findOne({ 
      where: { id },
      relations: ['proprietaire'],
    });
    if (!vehicule) {
      throw new NotFoundException(`Vehicule with id ${id} not found`);
    }
    return vehicule;
  }

  async updateVehicule(id: string, updateData: Partial<CreateVehiculeDto>): Promise<Vehicule> {
    if (updateData.proprietaireId) {
      const client = await this.clientRepository.findOne({ 
        where: { id: updateData.proprietaireId },
      });
      if (!client) {
        throw new NotFoundException(`Client with id ${updateData.proprietaireId} not found`);
      }
      delete updateData.proprietaireId;
      await this.vehiculeRepository.update(id, { ...updateData, proprietaire: client });
    } else {
      await this.vehiculeRepository.update(id, updateData);
    }

    return this.getVehiculeById(id);
  }

  async deleteVehicule(id: string): Promise<void> {
    const result = await this.vehiculeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Vehicule with id ${id} not found`);
    }
  }
  async getVehiculesByUserId(userId: string): Promise<Vehicule[]> {
    const vehicules = await this.vehiculeRepository.find({
      relations: ['proprietaire'],
      where: {
        proprietaire: {
          id: userId
        }
      }
    });
    
    if (!vehicules || vehicules.length === 0) {
      throw new NotFoundException(`No vehicles found for user with id ${userId}`);
    }
    
    return vehicules;
  }
}
