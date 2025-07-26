import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Colors } from "@/components/ui/colors";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useUser } from "../context/UserContext";

function IntensityBar({ level }: { level: number }) {
  return (
    <View style={styles.barContainer}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { backgroundColor: i <= level ? "#7E22CE" : "#D8B4FE" },
          ]}
        />
      ))}
    </View>
  );
}

const API_URL = "http://192.168.15.119:3000";

export default function HomeScreen() {
  const { user } = useUser();
  const name = user.name;
  const userId = user.userId;

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodSaved, setMoodSaved] = useState(false);
  const [todayMood, setTodayMood] = useState<any | null>(null);
  const [symptomsToday, setSymptomsToday] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaySymptoms();
    fetchTodayMood();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTodaySymptoms();
      fetchTodayMood();
    }, [])
  );

  const fetchTodaySymptoms = async () => {
    try {
      const response = await fetch(`${API_URL}/symptoms/${userId}/today`);
      const data = await response.json();
      setSymptomsToday(data);
    } catch (error) {
      console.error("Erro ao buscar sintomas do dia:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayMood = async () => {
    try {
      const response = await fetch(`${API_URL}/moods/${userId}`);
      const moods = await response.json();

      if (Array.isArray(moods) && moods.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayMoodEntry = moods.find((mood: any) => {
          const moodDate = new Date(mood.date);
          moodDate.setHours(0, 0, 0, 0);
          return moodDate.getTime() === today.getTime();
        });

        if (todayMoodEntry) {
          setTodayMood(todayMoodEntry);
          setMoodSaved(true);
          setSelectedMood(todayMoodEntry.label);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar humor do dia:", error);
    }
  };

  const saveMood = async () => {
    if (!selectedMood) return;

    try {
      const response = await fetch(`${API_URL}/moods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, label: selectedMood }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodayMood(data);
        setMoodSaved(true);
      } else {
        const err = await response.json();
        console.warn("Erro ao salvar humor:", err);
      }
    } catch (error) {
      console.error("Erro ao salvar humor:", error);
    }
  };

  const updateMood = async () => {
    if (!selectedMood) return;

    try {
      const response = await fetch(`${API_URL}/moods/${userId}/today`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: selectedMood }),
      });

      if (response.ok) {
        const updated = await response.json();
        setTodayMood(updated);
        setMoodSaved(true);
      } else {
        const err = await response.json();
        console.warn("Erro ao atualizar humor:", err);
      }
    } catch (error) {
      console.error("Erro ao atualizar humor:", error);
    }
  };

  const moods = [
    { icon: "emoticon-excited-outline", label: "Animado" },
    { icon: "emoticon-happy-outline", label: "Feliz" },
    { icon: "emoticon-cool-outline", label: "Calmo" },
    { icon: "emoticon-sad-outline", label: "Triste" },
    { icon: "emoticon-angry-outline", label: "Estressado" },
    { icon: "emoticon-dead-outline", label: "Horrível" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <ThemedText type="title" style={styles.greeting}>
          Olá {name}!
        </ThemedText>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/")}
          >
            <MaterialIcons
              name="logout"
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />

            <ThemedText style={styles.buttonText}>Sair</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ThemedText type="title" style={styles.title}>
        Como estou me sentindo?
      </ThemedText>

      {moodSaved ? (
        <View style={styles.savedMoodWrapper}>
          <View style={styles.savedMoodCard}>
            <MaterialCommunityIcons
              name={moods.find((m) => m.label === todayMood.label)?.icon as any}
              size={38}
              color={Colors.light.title}
            />
            <ThemedText style={styles.savedMoodLabel}>
              {todayMood.label}
            </ThemedText>
          </View>

          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => setMoodSaved(false)}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <ThemedText type="defaultSemiBold" style={styles.smallButtonText}>
              Editar
            </ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.moodContainer}>
            {moods.map(({ icon, label }, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.moodItemSmall,
                  selectedMood === label && styles.moodItemSelected,
                ]}
                onPress={() => setSelectedMood(label)}
              >
                <MaterialCommunityIcons
                  name={icon as any}
                  size={28}
                  color={
                    selectedMood === label
                      ? Colors.light.title
                      : Colors.light.subtitleDark
                  }
                />
                <ThemedText style={styles.emojiLabel}>{label}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.saveMoodButton,
              !selectedMood && styles.saveMoodDisabled,
            ]}
            disabled={!selectedMood}
            onPress={todayMood ? updateMood : saveMood}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <ThemedText type="defaultSemiBold" style={styles.smallButtonText}>
              {todayMood ? "Atualizar" : "Salvar"}
            </ThemedText>
          </TouchableOpacity>
        </>
      )}

      <ThemedText type="title" style={styles.title}>
        Sintomas do dia
      </ThemedText>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.button} />
      ) : symptomsToday.length === 0 ? (
        <ThemedText style={styles.emptyText}>
          Nenhum sintoma registrado hoje.
        </ThemedText>
      ) : (
        symptomsToday.map((symptom) => (
          <View key={symptom.id} style={styles.symptomCard}>
            <ThemedText style={styles.symptomName}>
              {symptom.symptomOption.name}
            </ThemedText>
            <ThemedText style={styles.intensity}>
              <IntensityBar level={symptom.severity} />
            </ThemedText>
            {symptom.note && (
              <ThemedText style={styles.note}>{symptom.note}</ThemedText>
            )}
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.smallButton}
        onPress={() => router.push("/newSymthom")}
      >
        <Ionicons
          name="add-circle-outline"
          size={20}
          color="#fff"
          style={{ marginRight: 6 }}
        />
        <ThemedText type="defaultSemiBold" style={styles.smallButtonText}>
          Registrar
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  moodItemSmall: {
    width: 80,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3E8FF",
    padding: 6,
  },

  emojiLabel: {
    fontSize: 13,
    marginTop: 4,
    color: Colors.light.text,
    textAlign: "center",
  },

  saveMoodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.button,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  saveMoodDisabled: {
    backgroundColor: "#CCC",
  },

  savedMoodWrapper: {
    width: "100%",
    alignItems: "center",
  },

  savedMoodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDD6FE",
    borderRadius: 10,
    paddingVertical: 4,
    width: "100%",
  },

  savedMoodLabel: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "bold",
    marginLeft: 10,
  },

  symptomCard: {
    backgroundColor: "#EDE9FE",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  symptomName: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "bold",
  },
  intensity: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.light.subtitle,
  },
  note: {
    marginTop: 4,
    fontSize: 13,
    fontStyle: "italic",
    color: Colors.light.subtitleDark,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.subtitle,
    marginTop: 12,
    textAlign: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontFamily: "PlayfairDisplay_400Regular",
    marginBottom: 8,
    fontSize: 24,
    color: Colors.light.title,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: Colors.light.button,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#F9F5FF",
    padding: 24,
  },
  title: {
    marginBottom: 8,
    fontSize: 20,
    color: Colors.light.subtitleDark,
    marginTop: 16,
  },
  smallButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.button,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  smallButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 8,
    gap: 8,
  },
  moodItem: {
    width: "30%",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#EDE9FE",
  },
  moodItemSelected: {
    backgroundColor: "#C4B5FD",
  },
  barContainer: {
    flexDirection: "row",
  },
  bar: {
    width: 24,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  symptomHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  typeText: {
    fontSize: 12,
    color: "#5B21B6",
  },
  symptomTitle: {
    fontSize: 16,
    color: Colors.light.subtitleDark,
  },
  symptomInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  symptomText: {
    fontSize: 14,
    color: Colors.light.text,
    marginRight: 8,
  },
});
