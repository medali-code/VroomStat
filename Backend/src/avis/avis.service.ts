// avis.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Avis, AvisStatus } from './entities/avis.entity';
import { CreateAvisDto } from './dto/create-avis.dto';
import { Repository } from 'typeorm';
import { Client } from '../client/entities/client.entity';
import { UpdateAviDto } from './dto/update-avis.dto'; // Importez le nouveau DTO

@Injectable()
export class AvisService {
  constructor(
    @InjectRepository(Avis)
    private readonly avisRepository: Repository<Avis>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async createAvis(createAvisDto: CreateAvisDto): Promise<Avis> {
    const { clientId, note, commentaire, statut } = createAvisDto;

    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException(`Client with id ${clientId} not found`);
    }

    const avis = this.avisRepository.create({
      note,
      commentaire,
      statut: statut || AvisStatus.PENDING, // Utilisez le statut fourni ou par défaut PENDING
      client,
    });

    return await this.avisRepository.save(avis);
  }

  async getAvis(): Promise<Avis[]> {
    return await this.avisRepository.find({ relations: ['client'] });
  }

  async getAvisById(id: string): Promise<Avis> {
    const avis = await this.avisRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!avis) {
      throw new NotFoundException(`Avis with id ${id} not found`);
    }
    return avis;
  }

  async updateAvis(id: string, updateData: UpdateAviDto): Promise<Avis> {
    const avis = await this.avisRepository.findOne({ where: { id } });
    if (!avis) {
      throw new NotFoundException(`Avis with id ${id} not found`);
    }

    // Mise à jour des propriétés de l'avis
    if (updateData.note) avis.note = updateData.note;
    if (updateData.commentaire) avis.commentaire = updateData.commentaire;
    if (updateData.statut) avis.statut = updateData.statut;
    if (updateData.clientId) {
      const client = await this.clientRepository.findOne({ where: { id: updateData.clientId } });
      if (!client) {
        throw new NotFoundException(`Client with id ${updateData.clientId} not found`);
      }
      avis.client = client;
    }

    return await this.avisRepository.save(avis);
  }

  async deleteAvis(id: string): Promise<void> {
    const result = await this.avisRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Avis with id ${id} not found`);
    }
  }
}