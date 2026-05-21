import { Body, Controller, Get, Post, Request } from "@nestjs/common";

import { AuthService } from "./auth.service.js";
import { RequestWithUser } from "./auth.types.js";
import { Public } from "./public.decorator.js";

type LoginBody = {
  email: string;
  password: string;
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  signIn(@Body() body: LoginBody) {
    return this.authService.signIn(body.email, body.password);
  }

  @Get("profile")
  getProfile(@Request() request: RequestWithUser) {
    return request.user;
  }
}
