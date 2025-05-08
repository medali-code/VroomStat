import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import { clientRepository } from './repository/client.repository';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    TypeOrmExModule.forCustomRepository([clientRepository]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
