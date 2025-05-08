// File: src/sinistre/sinistre.controller.ts
// Update the image serving route to match the frontend expected route

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, Put, Res, NotFoundException } from '@nestjs/common';
import { SinistreService } from './sinistre.service';
import { CreateSinistreDto } from './dto/create-sinistre.dto';
import { UpdateSinistreDto } from './dto/update-sinistre.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { Sinistre } from './entities/sinistre.entity';

@Controller('sinistres') // Base route for this controller
export class SinistreController {
  constructor(private readonly sinistreService: SinistreService) {}

  @Post()
  async create(@Body() createSinistreDto: CreateSinistreDto): Promise<Sinistre> {
    return this.sinistreService.createSinistre(createSinistreDto);
  }

  @Post('upload-multiple/:id')
  @UseInterceptors(FilesInterceptor('files', 10, {
    // Configuration for this endpoint is already in MulterModule.register
  }))
  async uploadMultipleImages(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<Sinistre> {
    if (!files || files.length === 0) {
      throw new NotFoundException('Aucun fichier trouvé.');
    }
    console.log(`${files.length} files received for sinistre ${id}`);
    const filenames = files.map(file => file.filename);
    console.log('Uploaded filenames:', filenames);
    return this.sinistreService.addMultipleImageFilenames(id, filenames);
  }

  // FIXED: Update route to match what frontend expects
  @Get('uploads/sinistres/:filename')
  serveImage(@Param('filename') filename: string, @Res() res: Response): any {
    const uploadDir = path.join(process.cwd(), './uploads');
    const imagePath = path.join(uploadDir, filename);

    console.log(`[ServeImage] Attempting to serve image: ${filename}`);
    console.log(`[ServeImage] Looking for file at: ${imagePath}`);

    if (fs.existsSync(imagePath)) {
      console.log(`[ServeImage] File found: ${imagePath}`);
      // Set appropriate content type based on file extension
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'image/jpeg'; // Default
      if (ext === '.png') {
        contentType = 'image/png';
      } else if (ext === '.gif') {
        contentType = 'image/gif';
      }
      res.type(contentType).sendFile(imagePath);
    } else {
      console.error(`[ServeImage] File not found: ${imagePath}`);
      res.status(404).send('Image non trouvée');
    }
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file', {
    // Configuration for this endpoint is already in MulterModule.register
  }))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Sinistre> {
    if (!file) {
      throw new NotFoundException('Aucun fichier trouvé.');
    }
    console.log('File received for sinistre', id, ':', file.filename);
    return this.sinistreService.addImageFilename(id, file.filename);
  }

  @Get()
  findAll() {
    return this.sinistreService.getSinistres();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sinistreService.getSinistreById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSinistreDto: UpdateSinistreDto) {
    return this.sinistreService.updateSinistre(id, updateSinistreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sinistreService.deleteSinistre(id);
  }

  @Put('approuver/:id')
  accepterSinistre(@Param('id') id: string) {
    return this.sinistreService.accepterSinistre(id);
  }
}