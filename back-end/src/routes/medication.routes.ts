import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { userId, name, dosage, frequency, startDate, endDate } = req.body;
  try {
    const medication = await prisma.medication.create({
      data: {
        userId,
        name,
        dosage,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });
    res.json(medication);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar medicamento" });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const medications = await prisma.medication.findMany({
      where: { userId: Number(userId) },
      orderBy: { startDate: "desc" },
    });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar medicamentos" });
  }
});

export default router;
