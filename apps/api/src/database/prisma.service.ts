import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient, prisma } from "@sambat/database";

@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly client: PrismaClient = prisma;

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
