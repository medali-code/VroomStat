import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginAdminDto } from '../dto/login-admin.dto';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginAdminDto })
  async login(@Body() credentials: LoginAdminDto) {
    const user = await this.authService.validateUser(credentials.email, credentials.password);
    return this.authService.login(user);
  }
}
