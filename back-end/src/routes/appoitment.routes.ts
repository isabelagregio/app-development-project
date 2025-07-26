// src/routes/appointment.routes.ts
import { Router } from "express";
import {
  createAppointment,
  getAppointmentsByUser,
  deleteAppointment,
} from "../services/appointment.service";
import { Request, Response } from "express";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const appointment = await createAppointment(req.body);
    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const appointments = await getAppointmentsByUser(Number(req.params.userId));
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
  }
});

router.delete("/:id", async (req, res) => {
  const appointmentId = Number(req.params.id);
  const userId = req.body.userId;

  try {
    await deleteAppointment(appointmentId, userId);
    res.json({ message: "Agendamento deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar agendamento" });
  }
});
export default router;
