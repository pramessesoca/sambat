import { Controller, Get } from "@nestjs/common";

import { Public } from "./auth/public.decorator.js";

@Controller()
export class HealthController {
  @Public()
  @Get("health")
  getHealth() {
    return {
      service: "sambat-api",
      status: "ok",
    };
  }
}
