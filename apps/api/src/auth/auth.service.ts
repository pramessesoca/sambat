import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";

import { UsersService } from "../users/users.service.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    const passwordMatches = user ? await compare(password, user.passwordHash) : false;

    if (!user || !passwordMatches) {
      throw new UnauthorizedException("Invalid admin credentials.");
    }

    return {
      accessToken: await this.jwtService.signAsync({
        email: user.email,
        role: user.role,
        sub: user.id,
      }),
    };
  }
}
