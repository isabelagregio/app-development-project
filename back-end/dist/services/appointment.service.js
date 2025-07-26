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
exports.deleteAppointment = exports.getAppointmentsByUser = exports.createAppointment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createAppointment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.appointment.create({
        data: {
            userId: data.userId,
            type: data.type,
            date: new Date(data.date),
            title: data.title,
            location: data.location,
            note: data.note,
            doctor: data.doctor,
        },
    });
});
exports.createAppointment = createAppointment;
const getAppointmentsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.appointment.findMany({
        where: { userId },
        orderBy: { date: "desc" },
    });
});
exports.getAppointmentsByUser = getAppointmentsByUser;
const deleteAppointment = (appointmentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.appointment.delete({
        where: {
            id_userId: {
                id: appointmentId,
                userId: userId,
            },
        },
    });
});
exports.deleteAppointment = deleteAppointment;
