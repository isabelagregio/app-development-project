import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { userId, type, date, notes, title, location } = req.body;

  try {
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        type,
        date: new Date(date),
        title,
        location,
      },
    });
    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: Number(userId) },
      orderBy: { date: "desc" },
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
  }
});

export default router;
