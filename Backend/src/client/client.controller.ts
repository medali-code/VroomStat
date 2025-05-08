import { Controller, Post, Put, Patch, Param, Body, UseInterceptors, UploadedFile, Delete, Get, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// Define storage options for multer
const storage = {
  storage: diskStorage({
    destination: './uploads/profile-images',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `profile-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
};

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // New endpoint for partial profile updates with optional file upload
  @Patch(':id/profile')
  @UseInterceptors(FileInterceptor('photoProfil', storage))
  async updateClientProfile(
    @Param('id') id: string,
    @Body() updateData: Partial<UpdateClientDto>,
    @UploadedFile() photoProfil?: Express.Multer.File,
  ): Promise<Client> {
    const updatedData = { ...updateData };
    
    // Add file path to update data if photo was uploaded
    if (photoProfil) {
      // You might need to prepend your API URL here to make the image accessible
      const photoUrl = `${process.env.API_URL || 'http://localhost:3000'}/uploads/profile-images/${photoProfil.filename}`;
      updatedData['photoProfil'] = photoUrl;
    }
    
    return this.clientService.updateClientPartial(id, updatedData);
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.getClientById(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('photoProfil', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `profile-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const clientData: any = updateClientDto;
    // Si un fichier a été uploadé, ajoutez le chemin d'accès à l'objet de mise à jour
    if (file) {
      clientData.photoProfil = `uploads/profile-images/${file.filename}`;
    }
    return this.clientService.updateClientPartial(id, clientData);
  }


  @Post()
  create(@Body() dto: CreateClientDto): Promise<Client> {
    return this.clientService.createClient(dto);
  }

  @Get()
  findAll(): Promise<Client[]> {
    return this.clientService.getClients();
  }

  


  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.clientService.deleteClient(id);
  }
}