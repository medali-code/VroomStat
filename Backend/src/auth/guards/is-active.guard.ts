import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class IsActiveGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return !!(user && user.isActive);
  }
}
