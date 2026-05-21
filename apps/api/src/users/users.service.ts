import { Injectable } from "@nestjs/common";
import { User } from "@sambat/database";

import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.client.user.findUnique({
      where: { email },
    });
  }
}
