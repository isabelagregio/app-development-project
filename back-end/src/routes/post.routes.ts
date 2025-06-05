import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { userId, title, content } = req.body;

  try {
    const message = await prisma.post.create({
      data: { userId, title, content },
    });
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar mensagem" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const messages = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar mensagens" });
  }
});

export default router;
