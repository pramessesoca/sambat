import { Injectable } from "@nestjs/common";
import { UserRole } from "@sambat/types";

import { AuthUser } from "../auth/auth.types.js";
import { PrismaService } from "../database/prisma.service.js";
import { CreateAgencyDto } from "./dto/create-agency.dto.js";

export type AgencyResponse = {
  description: string | null;
  id: string;
  name: string;
};

@Injectable()
export class AgenciesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(dto: CreateAgencyDto): Promise<AgencyResponse> {
    return this.prismaService.client.agency.create({
      data: dto,
      select: {
        description: true,
        id: true,
        name: true,
      },
    });
  }

  listForUser(user: AuthUser): Promise<AgencyResponse[]> {
    return this.prismaService.client.agency.findMany({
      orderBy: { name: "asc" },
      select: {
        description: true,
        id: true,
        name: true,
      },
      where: user.role === UserRole.AGENCY_ADMIN ? { users: { some: { id: user.sub } } } : undefined,
    });
  }
}
