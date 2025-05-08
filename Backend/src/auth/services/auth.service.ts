import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientService: ClientService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const client = await this.clientService.findOneByEmail(email);
    if (client && (await bcrypt.compare(password, client.motDePasse))) {
      const { motDePasse, ...result } = client;
      return result;
    }
    throw new UnauthorizedException('Identifiants invalides');
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
