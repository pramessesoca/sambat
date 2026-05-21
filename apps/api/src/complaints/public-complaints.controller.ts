import { Controller, Get, Param } from "@nestjs/common";

import { Public } from "../auth/public.decorator.js";
import { ComplaintsService } from "./complaints.service.js";

@Public()
@Controller("public/complaints")
export class PublicComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Get()
  list() {
    return this.complaintsService.listPublicComplaints();
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.complaintsService.getPublicComplaint(id);
  }
}

