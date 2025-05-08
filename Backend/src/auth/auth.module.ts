import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MemoryStoreService } from 'src/shared/services/memory-store.service';
import { SharedModule } from 'src/shared/shared.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as dotenv from 'dotenv';
import { ClientModule } from 'src/client/client.module';

dotenv.config();

@Module({
  imports: [
    // Importation de UsersModule qui exporte UsersService et AdminService avec les repositories
    ClientModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    SharedModule,
    CacheModule.register({ ttl: null }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MemoryStoreService],
})
export class AuthModule {}
