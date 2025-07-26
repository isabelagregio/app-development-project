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
// src/routes/appointment.routes.ts
const express_1 = require("express");
const appointment_service_1 = require("../services/appointment.service");
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointment = yield (0, appointment_service_1.createAppointment)(req.body);
        res.json(appointment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar agendamento" });
    }
}));
router.get("/user/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointments = yield (0, appointment_service_1.getAppointmentsByUser)(Number(req.params.userId));
        res.json(appointments);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentId = Number(req.params.id);
    const userId = req.body.userId;
    try {
        yield (0, appointment_service_1.deleteAppointment)(appointmentId, userId);
        res.json({ message: "Agendamento deletado com sucesso" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao deletar agendamento" });
    }
}));
exports.default = router;
