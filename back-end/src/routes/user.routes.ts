import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const {
    name,
    email,
    birthday,
    phone,
    disease,
    diagnosisDate,
    username,
    password,
  } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        birthday: new Date(birthday),
        phone,
        disease,
        diagnosisDate: new Date(diagnosisDate),
        username,
        password,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
});

router.get("/", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default router;
