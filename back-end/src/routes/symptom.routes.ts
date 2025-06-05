import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { userId, name, severity, note } = req.body;

  try {
    const symptom = await prisma.symptom.create({
      data: {
        userId,
        name,
        severity,
        note,
      },
    });
    res.status(201).json(symptom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create symptom" });
  }
});

router.get("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const symptoms = await prisma.symptom.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(symptoms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch symptoms" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.symptom.delete({ where: { id } });
    res.json({ message: "Symptom deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete symptom" });
  }
});

export default router;
