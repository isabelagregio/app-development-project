import { Router } from "express";
import { login } from "../services/auth.service";

const router = Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await login(username, password);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

export default router;
