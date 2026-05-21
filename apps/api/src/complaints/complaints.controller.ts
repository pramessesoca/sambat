import { Body, Controller, Get, Param, Patch, Post, Request, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UserRole } from "@sambat/types";

import { Public } from "../auth/public.decorator.js";
import { RequestWithUser } from "../auth/auth.types.js";
import { Roles } from "../auth/roles.decorator.js";
import { ImageAttachment } from "../storage/image-attachment.types.js";
import { validateImageAttachments } from "../storage/image-validation.js";
import { ComplaintsService } from "./complaints.service.js";
import { CreateWebComplaintDto } from "./dto/create-web-complaint.dto.js";
import { UpdateComplaintDto } from "./dto/update-complaint.dto.js";

@Controller("complaints")
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Public()
  @Post("web")
  @UseInterceptors(FilesInterceptor("images"))
  createWebComplaint(
    @Body() dto: CreateWebComplaintDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    validateImageAttachments(files);

    return this.complaintsService.createWebComplaint(dto, files as ImageAttachment[]);
  }

  @Roles(UserRole.SUPERADMIN, UserRole.AGENCY_ADMIN)
  @Get()
  listAdminComplaints(@Request() request: RequestWithUser) {
    return this.complaintsService.listAdminComplaints(request.user!);
  }

  @Roles(UserRole.SUPERADMIN, UserRole.AGENCY_ADMIN)
  @Patch(":id")
  updateComplaint(@Param("id") id: string, @Body() dto: UpdateComplaintDto, @Request() request: RequestWithUser) {
    return this.complaintsService.updateComplaint(id, dto, request.user!);
  }
}
