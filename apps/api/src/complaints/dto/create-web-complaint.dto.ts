import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateWebComplaintDto {
  @IsString()
  @MinLength(8)
  @MaxLength(4000)
  message!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  sender!: string;
}

