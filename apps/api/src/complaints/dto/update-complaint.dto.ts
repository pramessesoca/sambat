import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { ComplaintPriority, ComplaintStatus } from "@sambat/types";

export class UpdateComplaintDto {
  @IsOptional()
  @IsString()
  agencyId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  category?: string;

  @IsOptional()
  @IsEnum(ComplaintPriority)
  priority?: ComplaintPriority;

  @IsOptional()
  @IsEnum(ComplaintStatus)
  status?: ComplaintStatus;
}

