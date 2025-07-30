import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  if (password !== user.password) {
    throw new Error(`Senha incorreta`);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function getUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
  });
}
