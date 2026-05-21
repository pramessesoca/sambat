import { Body, Controller, Get, Post, Request } from "@nestjs/common";
import { UserRole } from "@sambat/types";

import { RequestWithUser } from "../auth/auth.types.js";
import { Roles } from "../auth/roles.decorator.js";
import { AgenciesService, AgencyResponse } from "./agencies.service.js";
import { CreateAgencyDto } from "./dto/create-agency.dto.js";

@Controller("agencies")
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Roles(UserRole.SUPERADMIN)
  @Post()
  create(@Body() dto: CreateAgencyDto): Promise<AgencyResponse> {
    return this.agenciesService.create(dto);
  }

  @Roles(UserRole.SUPERADMIN, UserRole.AGENCY_ADMIN)
  @Get()
  list(@Request() request: RequestWithUser): Promise<AgencyResponse[]> {
    return this.agenciesService.listForUser(request.user!);
  }
}
