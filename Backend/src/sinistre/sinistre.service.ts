// File: src/sinistre/sinistre.service.ts
// Update the getImageUrl method to match the controller route

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sinistre, SinistreStatut } from './entities/sinistre.entity';
import { CreateSinistreDto } from './dto/create-sinistre.dto';
import { UpdateSinistreDto } from './dto/update-sinistre.dto';
import { Client } from '../client/entities/client.entity';
import { Vehicule } from '../vehicule/entities/vehicule.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SinistreService {
  constructor(
    @InjectRepository(Sinistre) private readonly sinistreRepo: Repository<Sinistre>,
    @InjectRepository(Client)   private readonly clientRepo:  Repository<Client>,
    @InjectRepository(Vehicule) private readonly vehiculeRepo: Repository<Vehicule>,
  ) {
    // Assurer que le dossier d'uploads existe au démarrage du service
    const uploadDir = path.join(process.cwd(), 'uploads/sinistres');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  }

  async createSinistre(dto: CreateSinistreDto): Promise<Sinistre> {
    const client = await this.clientRepo.findOne({ where: { id: dto.clientId } });
    if (!client) throw new NotFoundException(`Client ${dto.clientId} introuvable`);

    const vehicule = await this.vehiculeRepo.findOne({ where: { id: dto.vehiculeId } });
    if (!vehicule) throw new NotFoundException(`Véhicule ${dto.vehiculeId} introuvable`);

    const sinistre = this.sinistreRepo.create({
      ...dto,
      dateDeclaration: new Date(dto.dateDeclaration),
      client,
      vehicule,
      // images are handled after creation via upload endpoints
      images: [], // Ensure images is initialized as empty for new creation
    });
    return this.sinistreRepo.save(sinistre);
  }

  async getSinistres(): Promise<Sinistre[]> {
    return this.sinistreRepo.find({ relations: ['client', 'vehicule'] });
  }

  async getSinistreById(id: string): Promise<Sinistre> {
    const sin = await this.sinistreRepo.findOne({
      where: { id },
      relations: ['client', 'vehicule'],
    });
    if (!sin) throw new NotFoundException(`Sinistre ${id} introuvable`);
    return sin;
  }

  async updateSinistre(id: string, dto: UpdateSinistreDto): Promise<Sinistre> {
    const sin = await this.getSinistreById(id);

    if (dto.clientId) {
      const client = await this.clientRepo.findOne({ where: { id: dto.clientId } });
      if (!client) throw new NotFoundException(`Client ${dto.clientId} introuvable`);
      sin.client = client;
    }

    if (dto.vehiculeId) {
      const vehicule = await this.vehiculeRepo.findOne({ where: { id: dto.vehiculeId } });
      if (!vehicule) throw new NotFoundException(`Véhicule ${dto.vehiculeId} introuvable`);
      sin.vehicule = vehicule;
    }

    if (dto.dateDeclaration) {
      sin.dateDeclaration = new Date(dto.dateDeclaration);
    }
    
    // Ensure images are not overwritten if not provided in update DTO
    if (dto.images !== undefined) {
      sin.images = dto.images;
    }

    // This will update simple properties like lieu, commentaire, type, statut, etc.
    Object.assign(sin, dto); 
    return this.sinistreRepo.save(sin);
  }

  async deleteSinistre(id: string): Promise<void> {
    const sinistre = await this.getSinistreById(id);

    // Supprimer les images associées
    if (sinistre.images && sinistre.images.length > 0) {
      for (const imagePath of sinistre.images) {
        try {
          // Construct the full path to the file in the uploads directory
          const fullPath = path.join(process.cwd(), 'uploads/sinistres', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          } else {
            console.warn(`Fichier image non trouvé lors de la suppression: ${fullPath}`);
          }
        } catch (error) {
          console.error(`Erreur lors de la suppression de l'image ${imagePath}:`, error);
        }
      }
    }

    const res = await this.sinistreRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`Sinistre ${id} introuvable`);
  }

  async accepterSinistre(id: string): Promise<Sinistre> {
    const sin = await this.getSinistreById(id);
    sin.statut = SinistreStatut.VALIDE;
    return this.sinistreRepo.save(sin);
  }

  /**
   * Ajoute un nom de fichier d'image à un sinistre existant
   */
  async addImageFilename(id: string, filename: string): Promise<Sinistre> {
    const sinistre = await this.getSinistreById(id);

    // Initialize images array if null or undefined
    if (!sinistre.images) {
      sinistre.images = [];
    }

    sinistre.images.push(filename);
    return this.sinistreRepo.save(sinistre);
  }

  /**
   * Ajoute plusieurs noms de fichiers d'images à un sinistre existant
   */
  async addMultipleImageFilenames(id: string, filenames: string[]): Promise<Sinistre> {
    const sinistre = await this.getSinistreById(id);

    // Initialize images array if null or undefined
    if (!sinistre.images) {
      sinistre.images = [];
    }

    sinistre.images = [...sinistre.images, ...filenames];
    return this.sinistreRepo.save(sinistre);
  }

  /**
   * Retourne l'URL pour accéder à une image
   * FIXED: Updated to match the controller route and frontend expected URL format
   */
  getImageUrl(filename: string): string {
    // FIXED: This should match the endpoint in the controller
    return `/sinistres/uploads/sinistres/${filename}`;
  }
}