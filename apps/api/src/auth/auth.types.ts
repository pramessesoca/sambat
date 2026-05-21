import { UserRole } from "@sambat/types";

export type AuthUser = {
  email: string;
  role: UserRole;
  sub: string;
};

export type RequestWithUser = {
  headers: {
    authorization?: string;
  };
  user?: AuthUser;
};
