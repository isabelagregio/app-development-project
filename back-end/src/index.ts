import express from "express";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./routes/user.routes";
import medicationRoutes from "./routes/medication.routes";
import appointmentRoutes from "./routes/appoitment.routes";
import symptomRoutes from "./routes/symptom.routes";
import loginRoutes from "./routes/auth.routes";
import moodRoutes from "./routes/mood.routes";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/medications", medicationRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/symptoms", symptomRoutes);
app.use("/login", loginRoutes);
app.use("/moods", moodRoutes);

app.get("/", (_req, res) => {
  res.send("OncoTrack API is running");
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor rodando em http://192.168.15.119:3000");
});
