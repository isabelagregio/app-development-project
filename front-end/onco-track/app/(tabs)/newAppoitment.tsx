import { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { Colors } from "@/components/ui/colors";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "../context/UserContext";
import Constants from "expo-constants";

export default function CreateAppointmentScreen() {
  const API_URL = Constants.expoConfig?.extra?.API_URL;
  const { user } = useUser();
  const userId = user.userId;

  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [location, setLocation] = useState("");
  const [doctor, setDoctor] = useState("");
  const [note, setNote] = useState("");

  const appointmentOptions = ["Exame", "Consulta", "Tratamento"] as const;
  type AppointmentOption = (typeof appointmentOptions)[number];
  const [type, setType] = useState<AppointmentOption>("Consulta");

  const typeMap = {
    Consulta: "CONSULTATION",
    Exame: "EXAM",
    Tratamento: "TREATMENT",
  } as const;

  const handleSave = async () => {
    if (!date || !time) {
      alert("Por favor, selecione data e horário");
      return;
    }

    const mergedDateTime = new Date(date);
    mergedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

    const payload = {
      userId,
      type: typeMap[type],
      date: mergedDateTime,
      title: `${type} com ${doctor || "profissional de saúde"}`,
      location,
      note,
      doctor,
    };

    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      alert("Compromisso agendado com sucesso!");

      setDate(null);
      setTime(null);
      setLocation("");
      setDoctor("");
      setNote("");
      setType("Consulta");

      router.push("/appoitments");
    } catch (err) {
      alert("Erro ao salvar compromisso");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F9F5FF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText type="title" style={styles.title}>
          Agendar Compromisso
        </ThemedText>

        <View style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
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
                  type="default"
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

          <ThemedText type="defaultSemiBold" style={styles.label}>
            <MaterialIcons name="event" size={16} /> Data
          </ThemedText>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <ThemedText style={styles.inputText}>
              {date ? date.toLocaleDateString() : "Selecionar data"}
            </ThemedText>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              value={date || new Date()}
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          <ThemedText type="defaultSemiBold" style={styles.label}>
            <MaterialIcons name="schedule" size={16} /> Horário
          </ThemedText>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
          >
            <ThemedText style={styles.inputText}>
              {time
                ? time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Selecionar horário"}
            </ThemedText>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              mode="time"
              value={time || new Date()}
              is24Hour={true}
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setTime(selectedTime);
              }}
            />
          )}

          <ThemedText type="defaultSemiBold" style={styles.label}>
            <MaterialIcons name="place" size={16} /> Local
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Ex: Clínica Vida"
            value={location}
            onChangeText={setLocation}
          />

          <ThemedText type="defaultSemiBold" style={styles.label}>
            <MaterialIcons name="person" size={16} /> Médico (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Ex: Dra. Carolina"
            value={doctor}
            onChangeText={setDoctor}
          />

          <ThemedText type="defaultSemiBold" style={styles.label}>
            <MaterialIcons name="note" size={16} /> Observação (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Ex: Levar exames"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <ThemedText type="defaultSemiBold" style={{ color: "#fff" }}>
            Salvar compromisso
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#F9F5FF",
  },
  title: {
    fontSize: 22,
    color: Colors.light.title,
    marginBottom: 8,
  },
  inputText: {
    fontSize: 14,
    color: Colors.light.inputBorder,
  },
  card: {
    backgroundColor: "#F3E8FF",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
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
    justifyContent: "center",
    marginBottom: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#DDD6FE",
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
    marginTop: 12,
    marginBottom: 24,
  },
});
