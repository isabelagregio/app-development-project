import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAppointment = async (data: any) => {
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
};

export const getAppointmentsByUser = async (userId: number) => {
  return prisma.appointment.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
};

export const deleteAppointment = async (
  appointmentId: number,
  userId: number
) => {
  return prisma.appointment.delete({
    where: {
      id_userId: {
        id: appointmentId,
        userId: userId,
      },
    },
  });
};
