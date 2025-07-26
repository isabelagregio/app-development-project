import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createNewSymptomOption(req: Request, res: Response) {
  const { name, userId } = req.body;
  console.log(`${name}, ${userId}`);
  try {
    const newOption = await prisma.symptomOption.create({
      data: {
        name,
        userId,
      },
    });
    res.status(201).json(newOption);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create symptom option" });
  }
}

// Buscar opções de sintomas do usuário
export async function getSymptomOptions(req: Request, res: Response) {
  const userId = parseInt(req.params.userId);

  try {
    const options = await prisma.symptomOption.findMany({
      where: { userId },
    });
    res.json(options);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch symptom options" });
  }
}

// Criar novo sintoma
export async function createSymptom(req: Request, res: Response) {
  const { userId, symptomOptionId, severity, note } = req.body;

  try {
    const symptom = await prisma.symptom.create({
      data: {
        userId,
        symptomOptionId,
        severity,
        note,
      },
      include: {
        symptomOption: true,
      },
    });
    res.status(201).json(symptom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create symptom" });
  }
}

// Buscar sintomas do usuário
export async function getUserSymptoms(req: Request, res: Response) {
  const userId = parseInt(req.params.userId);

  try {
    const symptoms = await prisma.symptom.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        symptomOption: true,
      },
    });
    res.json(symptoms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch symptoms" });
  }
}

// GET /symptoms/today/:userId
export async function getTodayUserSymptoms(req: Request, res: Response) {
  const userId = parseInt(req.params.userId);

  try {
    // Definir início do dia (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Definir início do próximo dia (00:00:00 do dia seguinte)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const symptoms = await prisma.symptom.findMany({
      where: {
        userId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        symptomOption: true,
      },
    });

    res.json(symptoms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch symptoms" });
  }
}

// Deletar sintoma
export async function deleteSymptom(req: Request, res: Response) {
  const id = parseInt(req.params.id);

  try {
    await prisma.symptom.delete({ where: { id } });
    res.json({ message: "Symptom deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete symptom" });
  }
}
