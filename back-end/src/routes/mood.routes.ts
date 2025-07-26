import express, { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { userId, label } = req.body;
  try {
    const mood = await prisma.mood.create({
      data: {
        label,
        userId,
      },
    });

    res.status(201).json(mood);
  } catch (error) {
    console.error("Erro ao salvar humor:", error);
    res.status(500).json({ error: "Erro ao salvar humor." });
  }
});

router.get("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const moods = await prisma.mood.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    res.json(moods);
  } catch (error) {
    console.error("Erro ao buscar humores:", error);
    res.status(500).json({ error: "Erro ao buscar humores." });
  }
});

router.put("/:userId/today", async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { label } = req.body;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const moodToday = await prisma.mood.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    const updatedMood = await prisma.mood.update({
      where: { id: moodToday?.id },
      data: { label },
    });

    res.json(updatedMood);
  } catch (error) {
    console.error("Erro ao atualizar humor:", error);
    res.status(500).json({ error: "Erro ao atualizar humor." });
  }
});

export default router;
