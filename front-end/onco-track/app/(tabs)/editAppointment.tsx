import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Constants from "expo-constants";
import { useUser } from "../context/UserContext";
import { Colors } from "@/components/ui/colors";

export default function EditAppointmentScreen() {
  // const API_URL = Constants.expoConfig?.extra?.API_URL;
  const API_URL = "http://192.168.15.119:3000";
  const { user } = useUser();

  const { appointment } = useLocalSearchParams();
  const parsedAppointment = JSON.parse(appointment as string);
  const combinedDateTimeString = `${parsedAppointment.date}T${parsedAppointment.time}`;
  const initialDate = new Date(combinedDateTimeString);

  const [date, setDate] = useState<Date>(initialDate);
  const [time, setTime] = useState<Date>(initialDate);
  const [location, setLocation] = useState(parsedAppointment.location || "");
  const [doctor, setDoctor] = useState(parsedAppointment.doctor || "");
  const [note, setNote] = useState(parsedAppointment.note || "");
  const typeMap = {
    Consulta: "CONSULTATION",
    Exame: "EXAM",
    Tratamento: "TREATMENT",
  } as const;

  type AppointmentTypeKey = keyof typeof typeMap;

  const [type, setType] = useState<AppointmentTypeKey>(
    (Object.entries(typeMap).find(
      ([, v]) => v === parsedAppointment.type
    )?.[0] as AppointmentTypeKey) || "Consulta"
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleUpdate = async () => {
    const updatedDate = new Date(date);
    updatedDate.setHours(time.getHours(), time.getMinutes(), 0, 0);

    const payload = {
      userId: user?.userId,
      type: typeMap[type],
      date: updatedDate,
      title: `${type} com ${doctor || "profissional de saúde"}`,
      location,
      note,
      doctor,
    };

    try {
      const res = await fetch(
        `${API_URL}/appointments/${parsedAppointment.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Erro ao atualizar compromisso");

      alert("Compromisso atualizado com sucesso!");
      router.replace("/appoitments");
    } catch (err) {
      alert("Erro ao atualizar compromisso");
    }
  };

  const appointmentOptions = ["Exame", "Consulta", "Tratamento"] as const;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F9F5FF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Editar Compromisso
        </ThemedText>

        <View style={styles.card}>
          <ThemedText style={styles.label}>
            <MaterialIcons name="category" size={16} /> Tipo
          </ThemedText>
          <View style={styles.chipContainer}>
            {appointmentOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.chip, type === option && styles.chipSelected]}
                onPress={() => setType(option)}
              >
                <ThemedText
                  style={[
                    styles.chipText,
                    type === option && styles.chipTextSelected,
                  ]}
                >
                  {option}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <ThemedText style={styles.label}>
            <MaterialIcons name="event" size={16} /> Data
          </ThemedText>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <ThemedText style={styles.inputText}>
              {date.toLocaleDateString()}
            </ThemedText>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              value={date}
              display="default"
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          <ThemedText style={styles.label}>
            <MaterialIcons name="schedule" size={16} /> Horário
          </ThemedText>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
          >
            <ThemedText style={styles.inputText}>
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </ThemedText>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              mode="time"
              value={time}
              is24Hour
              display="default"
              onChange={(_, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setTime(selectedTime);
              }}
            />
          )}

          <ThemedText style={styles.label}>
            <MaterialIcons name="place" size={16} /> Local
          </ThemedText>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />

          <ThemedText style={styles.label}>
            <MaterialIcons name="person" size={16} /> Médico (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={doctor}
            onChangeText={setDoctor}
          />

          <ThemedText style={styles.label}>
            <MaterialIcons name="note" size={16} /> Observações (opcional)
          </ThemedText>
          <TextInput style={styles.input} value={note} onChangeText={setNote} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <ThemedText style={{ color: "#fff" }}>
            Atualizar compromisso
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    color: Colors.light.title,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#F3E8FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: Colors.light.subtitleDark,
  },
  input: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#DDD6FE",
    justifyContent: "center",
    color: Colors.light.subtext,
  },
  chipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  chip: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderColor: "#DDD6FE",
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  chipSelected: {
    backgroundColor: Colors.light.button,
    borderColor: Colors.light.button,
  },
  chipText: {
    fontSize: 14,
    color: Colors.light.subtitleDark,
  },
  chipTextSelected: {
    color: "#fff",
  },
  button: {
    height: 48,
    backgroundColor: Colors.light.button,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 24,
  },
  inputText: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
});
