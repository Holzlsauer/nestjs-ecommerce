import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserPayload } from './authentication.service';

export interface RequestWithUser extends Request {
  user: UserPayload
}

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  private getTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const accessToken = this.getTokenFromHeader(request)

    if (!accessToken) {
      throw new UnauthorizedException('Authentication error')
    }

    try {
      const payload: UserPayload = await this.jwtService.verifyAsync(accessToken)
      request.user = payload
    } catch (error) {
      console.error(error)
      throw new UnauthorizedException('Invalid token')
    }

    return true;
  }
}
