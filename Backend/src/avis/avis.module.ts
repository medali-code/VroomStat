import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvisController } from './avis.controller';
import { AvisService } from './avis.service';
import { Avis } from './entities/avis.entity';
import { Client } from '../client/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Avis, Client])],
  controllers: [AvisController],
  providers: [AvisService],
})
export class AvisModule {}
