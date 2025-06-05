import express from "express";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import medicationRoutes from "./routes/medication.routes";
import appointmentRoutes from "./routes/appoitment.routes";
import symptomRoutes from "./routes/symptom.routes";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/medications", medicationRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/symptoms", symptomRoutes);

app.get("/", (_req, res) => {
  res.send("OncoTrack API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
