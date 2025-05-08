import { CacheModule } from '@nestjs/cache-manager';
import {  Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from './database/typeorm-ex.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientModule } from './client/client.module';
import { VehiculeModule } from './vehicule/vehicule.module';
import { SinistreModule } from './sinistre/sinistre.module';
import { AvisModule } from './avis/avis.module';
import { Client } from './client/entities/client.entity';
import { Vehicule } from './vehicule/entities/vehicule.entity';
import { Sinistre } from './sinistre/entities/sinistre.entity';
import { Avis } from './avis/entities/avis.entity';


@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ ttl: null, isGlobal: true, }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Client, Vehicule, Sinistre, Avis],       migrations: ["dist/migration/*{.ts,.js}"],
      synchronize: true,
      logging: false,
      ssl: false
    }),
    TypeOrmExModule.forCustomRepository([]),
    ScheduleModule.forRoot(),
    AuthModule,
    HttpModule,
    SharedModule,
    ClientModule,
    VehiculeModule,
    SinistreModule,
    AvisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

