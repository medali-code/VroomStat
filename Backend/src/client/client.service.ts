import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from './entities/client.entity';
import { clientRepository } from './repository/client.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(clientRepository)
    private readonly clientRepository: clientRepository,
  ) {}

  async createClient(dto: CreateClientDto): Promise<Client> {
    const hashed = await bcrypt.hash(dto.motDePasse, 10);
    const client = this.clientRepository.create({ ...dto, motDePasse: hashed });
    return this.clientRepository.save(client);
  }

  async getClients(): Promise<Client[]> {
    return this.clientRepository.find({ relations: ['vehicules', 'sinistres', 'avis'] });
  }

  async getClientById(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['vehicules', 'sinistres', 'avis'],
    });
    if (!client) throw new NotFoundException(`Client ${id} introuvable`);
    return client;
  }

  // Method for full updates (all fields required)
  async updateClient(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.getClientById(id);
    if (dto.motDePasse) {
      dto.motDePasse = await bcrypt.hash(dto.motDePasse, 10);
    }
    Object.assign(client, dto);
    return this.clientRepository.save(client);
  }

  // New method for partial updates (only update specified fields)
  async updateClientPartial(id: string, partialDto: Partial<UpdateClientDto & { photoProfil?: string }>): Promise<Client> {
    const client = await this.getClientById(id);
    
    // Only hash password if it's provided
    if (partialDto.motDePasse) {
      partialDto.motDePasse = await bcrypt.hash(partialDto.motDePasse, 10);
    }
    
    // Merge only the provided fields
    Object.keys(partialDto).forEach(key => {
      if (partialDto[key] !== undefined) {
        client[key] = partialDto[key];
      }
    });
    
    return this.clientRepository.save(client);
  }

  async deleteClient(id: string): Promise<void> {
    const result = await this.clientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client ${id} introuvable`);
    }
  }

  async findOneByEmail(email: string): Promise<Client> {
    return this.clientRepository.findOne({ where: { email } });
  }
}