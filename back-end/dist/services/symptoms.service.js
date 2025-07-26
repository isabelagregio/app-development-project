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
exports.createNewSymptomOption = createNewSymptomOption;
exports.getSymptomOptions = getSymptomOptions;
exports.createSymptom = createSymptom;
exports.getUserSymptoms = getUserSymptoms;
exports.getTodayUserSymptoms = getTodayUserSymptoms;
exports.deleteSymptom = deleteSymptom;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function createNewSymptomOption(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, userId } = req.body;
        console.log(`${name}, ${userId}`);
        try {
            const newOption = yield prisma.symptomOption.create({
                data: {
                    name,
                    userId,
                },
            });
            res.status(201).json(newOption);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create symptom option" });
        }
    });
}
// Buscar opções de sintomas do usuário
function getSymptomOptions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = parseInt(req.params.userId);
        try {
            const options = yield prisma.symptomOption.findMany({
                where: { userId },
            });
            res.json(options);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch symptom options" });
        }
    });
}
// Criar novo sintoma
function createSymptom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, symptomOptionId, severity, note } = req.body;
        try {
            const symptom = yield prisma.symptom.create({
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create symptom" });
        }
    });
}
// Buscar sintomas do usuário
function getUserSymptoms(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = parseInt(req.params.userId);
        try {
            const symptoms = yield prisma.symptom.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                include: {
                    symptomOption: true,
                },
            });
            res.json(symptoms);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch symptoms" });
        }
    });
}
// GET /symptoms/today/:userId
function getTodayUserSymptoms(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = parseInt(req.params.userId);
        try {
            // Definir início do dia (00:00:00)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            // Definir início do próximo dia (00:00:00 do dia seguinte)
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const symptoms = yield prisma.symptom.findMany({
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch symptoms" });
        }
    });
}
// Deletar sintoma
function deleteSymptom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        try {
            yield prisma.symptom.delete({ where: { id } });
            res.json({ message: "Symptom deleted successfully" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to delete symptom" });
        }
    });
}
