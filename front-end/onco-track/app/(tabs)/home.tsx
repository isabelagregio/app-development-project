import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import Constants from "expo-constants";

// Fonte Inter
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

function IntensityBar({ level }: { level: number }) {
  return (
    <View style={styles.barContainer}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { backgroundColor: i <= level ? "#6D28D9" : "#E9D5FF" },
          ]}
        />
      ))}
    </View>
  );
}

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function HomeScreen() {
  const { user } = useUser();
  const name = user.name;
  const userId = user.userId;
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodSaved, setMoodSaved] = useState(false);
  const [todayMood, setTodayMood] = useState<any | null>(null);
  const [symptomsToday, setSymptomsToday] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const moods = [
    { icon: "emoticon-excited-outline", label: "Animado" },
    { icon: "emoticon-happy-outline", label: "Feliz" },
    { icon: "emoticon-cool-outline", label: "Calmo" },
    { icon: "emoticon-sad-outline", label: "Triste" },
    { icon: "emoticon-angry-outline", label: "Estressado" },
    { icon: "emoticon-dead-outline", label: "Horrível" },
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(moods.length / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      flatListRef.current?.scrollToIndex({
        index: page * itemsPerPage,
        animated: true,
      });
      setCurrentPage(page);
    }
  };

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
      }
    } catch (error) {
      console.error("Erro ao atualizar humor:", error);
    }
  };

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#6D28D9" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <ThemedText type="title" style={styles.greeting}>
            Olá {name}!
          </ThemedText>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.push("/")}
          >
            <MaterialIcons
              name="logout"
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <ThemedText style={styles.logoutText}>Sair</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText type="title" style={styles.sectionTitle}>
          Como está se sentindo?
        </ThemedText>

        {moodSaved ? (
          <View style={styles.savedMoodWrapper}>
            <View style={styles.savedMoodCard}>
              <MaterialCommunityIcons
                name={
                  moods.find((m) => m.label === todayMood.label)?.icon as any
                }
                size={36}
                color="#6D28D9"
              />
              <ThemedText style={styles.savedMoodLabel}>
                {todayMood.label}
              </ThemedText>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setMoodSaved(false)}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <ThemedText style={styles.actionButtonText}>Editar</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Carousel de humores */}
            <View style={styles.carouselWrapper}>
              <TouchableOpacity
                onPress={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
              >
                <Ionicons
                  name="chevron-back-circle"
                  size={32}
                  color={currentPage === 0 ? "#D1D5DB" : "#6D28D9"}
                />
              </TouchableOpacity>

              <FlatList
                ref={flatListRef}
                data={moods}
                horizontal
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.moodItem,
                      selectedMood === item.label && styles.moodItemSelected,
                    ]}
                    onPress={() => setSelectedMood(item.label)}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={28}
                      color={
                        selectedMood === item.label ? "#6D28D9" : "#9CA3AF"
                      }
                    />
                    <ThemedText style={styles.moodLabel}>
                      {item.label}
                    </ThemedText>
                  </TouchableOpacity>
                )}
                getItemLayout={(data, index) => ({
                  length: 100,
                  offset: 100 * index,
                  index,
                })}
              />

              <TouchableOpacity
                onPress={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                <Ionicons
                  name="chevron-forward-circle"
                  size={32}
                  color={currentPage === totalPages - 1 ? "#D1D5DB" : "#6D28D9"}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                !selectedMood && styles.saveButtonDisabled,
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
              <ThemedText style={styles.saveButtonText}>
                {todayMood ? "Atualizar" : "Salvar"}
              </ThemedText>
            </TouchableOpacity>
          </>
        )}

        {/* Symptoms section */}
        <ThemedText type="title" style={styles.sectionTitle}>
          Sintomas do dia
        </ThemedText>

        {loading ? (
          <ActivityIndicator size="large" color="#6D28D9" />
        ) : symptomsToday.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            Nenhum sintoma registrado hoje.
          </ThemedText>
        ) : (
          symptomsToday.map((symptom) => {
            const createdAt = new Date(symptom.createdAt);
            const formattedTime = `${createdAt
              .getHours()
              .toString()
              .padStart(2, "0")}:${createdAt
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
            return (
              <View key={symptom.id} style={styles.symptomCardWrapper}>
                <View style={styles.symptomCard}>
                  <ThemedText style={styles.symptomName}>
                    {symptom.symptomOption.name}
                  </ThemedText>
                  <IntensityBar level={symptom.severity} />
                  {symptom.note && (
                    <ThemedText style={styles.note}>{symptom.note}</ThemedText>
                  )}
                </View>
                <View style={styles.timeFlag}>
                  <ThemedText style={styles.timeText}>
                    {formattedTime}
                  </ThemedText>
                </View>
              </View>
            );
          })
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/newSymthom")}
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <ThemedText style={styles.actionButtonText}>Registrar</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 24,
    backgroundColor: "#F9FAFB",
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
    color: "#374151",
    fontFamily: "Inter_600SemiBold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6D28D9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 18,
    color: "#4B5563",
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  carouselWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  moodItem: {
    width: 80,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 120,
    backgroundColor: "#F3E8FF",
  },
  moodItemSelected: {
    backgroundColor: "#DDD6FE",
    borderWidth: 2,
    borderColor: "#6D28D9",
  },
  moodLabel: {
    fontSize: 13,
    marginTop: 6,
    color: "#374151",
    fontFamily: "Inter_400Regular",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6D28D9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  savedMoodWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  savedMoodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDE9FE",
    borderRadius: 80,
    padding: 12,
    width: "100%",
    justifyContent: "center",
  },
  savedMoodLabel: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
    marginLeft: 10,
    fontFamily: "Inter_600SemiBold",
  },
  symptomCardWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  symptomCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  symptomName: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 6,
    fontFamily: "Inter_600SemiBold",
  },
  note: {
    marginTop: 6,
    fontSize: 13,
    fontStyle: "italic",
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
  },
  timeFlag: {
    position: "absolute",
    top: 8,
    right: 12,
    backgroundColor: "#6D28D9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  barContainer: {
    flexDirection: "row",
    marginTop: 6,
  },
  bar: {
    width: 20,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6D28D9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    marginVertical: 12,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
});
