import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sinistre } from './entities/sinistre.entity';
import { SinistreService } from './sinistre.service';
import { SinistreController } from './sinistre.controller';
import { Client }   from '../client/entities/client.entity';
import { Vehicule } from '../vehicule/entities/vehicule.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
@Module({

    imports: [
      TypeOrmModule.forFeature([Sinistre, Client, Vehicule]),
      MulterModule.register({
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${uniqueSuffix}${ext}`);
          },
        }),
        // IMPORTANT: Add fileFilter to ensure only accepted files are processed
        fileFilter: (req, file, cb) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true);
          } else {
            cb(new Error('Only image files are allowed!'), false);
          }
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      }),
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'uploads'),
        serveRoot: '/uploads',
      }),
      
      SinistreModule,
    ],
  providers: [SinistreService],
  controllers: [SinistreController],
})
export class SinistreModule {}
