import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

async function main() {
  await prisma.usuario.upsert({
    where: { email: "gerente@oficina.com" },
    update: {},
    create: {
      email: "gerente@oficina.com",
      senha_hash: await bcrypt.hash("admin123", 10),
      perfil: "GERENTE",
    },
  });

  await prisma.usuario.upsert({
    where: { email: "atendente@oficina.com" },
    update: {},
    create: {
      email: "atendente@oficina.com",
      senha_hash: await bcrypt.hash("atend123", 10),
      perfil: "ATENDENTE",
    },
  });

  console.log("Seed concluído.");
  console.log("Gerente:   gerente@oficina.com  / admin123");
  console.log("Atendente: atendente@oficina.com / atend123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
