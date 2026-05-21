import { hash } from "bcryptjs";

import { prisma, UserRole } from "../src/index.js";

const email = process.env.SUPERADMIN_EMAIL;
const password = process.env.SUPERADMIN_PASSWORD;

if (!email || !password) {
  throw new Error("SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD are required to seed the first admin.");
}

const passwordHash = await hash(password, 12);

await prisma.user.upsert({
  where: { email },
  update: {
    passwordHash,
    role: UserRole.SUPERADMIN,
  },
  create: {
    email,
    name: "Sambat Superadmin",
    passwordHash,
    role: UserRole.SUPERADMIN,
  },
});

await prisma.$disconnect();

