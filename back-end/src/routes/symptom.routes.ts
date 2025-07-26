import { Router } from "express";
import * as SymptomsService from "../services/symptoms.service";

const router = Router();
router.get("/options/:userId", SymptomsService.getSymptomOptions);
router.post("/options", SymptomsService.createNewSymptomOption);
router.post("/", SymptomsService.createSymptom);
router.get("/:userId", SymptomsService.getUserSymptoms);
router.get("/:userId/today", SymptomsService.getTodayUserSymptoms);
router.delete("/:id", SymptomsService.deleteSymptom);

export default router;
