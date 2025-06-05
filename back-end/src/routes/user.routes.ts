import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { name, email, birthday, phone, disease, diagnosisDate } = req.body;
  const user = await prisma.user.create({
    data: {
      name,
      email,
      birthday: new Date(birthday),
      phone,
      disease,
      diagnosisDate: new Date(diagnosisDate),
    },
  });
  res.json(user);
});

router.get("/", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default router;
