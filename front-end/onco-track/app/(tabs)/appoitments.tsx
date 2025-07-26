import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router, useFocusEffect } from "expo-router";
import { Colors } from "@/components/ui/colors";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import { useUser } from "../context/UserContext";

type Appointment = {
  id: string;
  type: "CONSULTATION" | "EXAM" | "TREATMENT" | string;
  location: string;
  date: string;
  doctor?: string;
  note?: string;
};

const typeTranslationMap: Record<string, string> = {
  CONSULTATION: "Consulta",
  EXAM: "Exame",
  TREATMENT: "Tratamento",
};

export default function ScheduleScreen() {
  const { user } = useUser();
  const userId = user.userId;
  const name = user.name;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  useFocusEffect(
    useCallback(() => {
      const fetchAppointments = async () => {
        try {
          const response = await fetch(
            `http://192.168.15.119:3000/appointments/user/${userId}`
          );
          if (!response.ok) throw new Error("Erro ao buscar agendamentos");
          const data = await response.json();
          setAppointments(data);
        } catch (error) {
          console.error("Erro ao buscar agendamentos:", error);
        }
      };

      fetchAppointments();
    }, [userId])
  );

  const appointmentsByDate = appointments.map((item) => ({
    ...item,
    date: dayjs(item.date).format("YYYY-MM-DD"),
    time: dayjs(item.date).format("HH:mm"),
  }));

  const markedDates = appointmentsByDate.reduce((acc, item) => {
    acc[item.date] = {
      marked: true,
      dotColor: "#7E22CE",
      selected: true,
      selectedColor: item.date === selectedDate ? "#7E22CE" : "#EDE9FE",
      selectedTextColor: item.date === selectedDate ? "#FFFFFF" : "#5B21B6",
    };
    return acc;
  }, {} as Record<string, any>);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://192.168.15.119:3000/appointments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Erro ao deletar");

      alert("Compromisso deletado com sucesso!");
      setAppointments((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Erro ao deletar compromisso");
    }
  };

  const filteredAppointments = appointmentsByDate.filter(
    (item) => item.date === selectedDate
  );

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.sectionTitle}>
        Meus compromissos
      </ThemedText>

      <Calendar
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...(markedDates[selectedDate] || {}),
            selected: true,
            selectedColor: "#7E22CE",
          },
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          calendarBackground: "#F9F5FF",
          todayTextColor: "#7E22CE",
          selectedDayTextColor: "#fff",
          arrowColor: "#7E22CE",
        }}
        style={styles.calendar}
      />

      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.typeTag}>
                <ThemedText type="defaultSemiBold" style={styles.typeText}>
                  {typeTranslationMap[item.type] ?? item.type}
                </ThemedText>
              </View>

              <View style={styles.iconRow}>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={{ marginLeft: 12 }}
                >
                  <Ionicons name="trash-outline" size={20} color="#B91C1C" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.appointmentInfoRow}>
              <View style={styles.appointmentInfoItem}>
                <Ionicons name="calendar-outline" size={18} color="#7E22CE" />
                <ThemedText type="default" style={styles.infoText}>
                  {dayjs(item.date).format("DD/MM")} às {item.time}
                </ThemedText>
              </View>

              <View style={styles.appointmentInfoItem}>
                <Ionicons name="location-outline" size={18} color="#7E22CE" />
                <ThemedText type="default" style={styles.infoText}>
                  {item.location}
                </ThemedText>
              </View>

              {item.doctor && (
                <View style={styles.appointmentInfoItem}>
                  <Ionicons name="medkit-outline" size={18} color="#7E22CE" />
                  <ThemedText type="default" style={styles.infoText}>
                    {item.doctor}
                  </ThemedText>
                </View>
              )}
            </View>

            {item.note && (
              <View style={[styles.appointmentInfoRow, { marginTop: 8 }]}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color="#7E22CE"
                />
                <ThemedText type="default" style={styles.infoText}>
                  {item.note}
                </ThemedText>
              </View>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/newAppoitment")}
      >
        <ThemedText type="defaultSemiBold" style={{ color: "#fff" }}>
          Agendar novo compromisso
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5FF",
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 22,
    color: Colors.light.title,
  },
  calendar: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#F3E8FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeTag: {
    backgroundColor: "#DDD6FE",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  typeText: {
    fontSize: 12,
    color: "#5B21B6",
  },
  appointmentInfoRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
    flexWrap: "wrap",
  },
  appointmentInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.light.text,
  },
  iconRow: {
    flexDirection: "row",
  },
  button: {
    height: 48,
    backgroundColor: Colors.light.button,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 20,
  },
  content: {
    paddingBottom: 32,
  },
});
