import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

export interface UserPayload {
  sub: string,
  name: string,
}

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email)
    const authenticated = await bcrypt.compare(password, user.password)

    if (!authenticated) {
      throw new UnauthorizedException('Email or password invalid')
    }

    const payload: UserPayload = {
      sub: user.id,
      name: user.name
    }

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
