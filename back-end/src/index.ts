// SEU ARQUIVO PRINCIPAL DO SERVIDOR (ex: index.ts ou server.ts)

import express from "express";
// 💡 Passo 1: Importe o pacote cors
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./routes/user.routes";
import medicationRoutes from "./routes/medication.routes";
import appointmentRoutes from "./routes/appoitment.routes";
import symptomRoutes from "./routes/symptom.routes";
import loginRoutes from "./routes/auth.routes";
import moodRoutes from "./routes/mood.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/users", userRoutes);
app.use("/medications", medicationRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/symptoms", symptomRoutes);
app.use("/login", loginRoutes);
app.use("/moods", moodRoutes);

app.get("/", (_req, res) => {
  res.send("OncoTrack API is running");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Servidor rodando em http://192.168.15.119:3000");
});
