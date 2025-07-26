"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, label } = req.body;
    try {
        const mood = yield prisma.mood.create({
            data: {
                label,
                userId,
            },
        });
        res.status(201).json(mood);
    }
    catch (error) {
        console.error("Erro ao salvar humor:", error);
        res.status(500).json({ error: "Erro ao salvar humor." });
    }
}));
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    try {
        const moods = yield prisma.mood.findMany({
            where: { userId },
            orderBy: { date: "desc" },
        });
        res.json(moods);
    }
    catch (error) {
        console.error("Erro ao buscar humores:", error);
        res.status(500).json({ error: "Erro ao buscar humores." });
    }
}));
router.put("/:userId/today", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    const { label } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    try {
        const moodToday = yield prisma.mood.findFirst({
            where: {
                userId,
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            },
        });
        const updatedMood = yield prisma.mood.update({
            where: { id: moodToday === null || moodToday === void 0 ? void 0 : moodToday.id },
            data: { label },
        });
        res.json(updatedMood);
    }
    catch (error) {
        console.error("Erro ao atualizar humor:", error);
        res.status(500).json({ error: "Erro ao atualizar humor." });
    }
}));
exports.default = router;
