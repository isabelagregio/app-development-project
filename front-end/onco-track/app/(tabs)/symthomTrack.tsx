import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/components/ui/colors";
import { Calendar } from "react-native-calendars";
import { BarChart } from "react-native-gifted-charts";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

const API_URL = "http://192.168.15.119:3000";

export default function SymthomTrackScreen() {
  const [symptomStats, setSymptomStats] = useState<
    { name: string; frequency: number }[]
  >([]);

  const { user } = useUser();
  const userId = user.userId;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await fetch(`${API_URL}/symptoms/${userId}`);
        const data = await response.json();

        const frequencyMap: Record<string, number> = {};
        data.forEach((symptom: any) => {
          const name = symptom.symptomOption.name;
          frequencyMap[name] = (frequencyMap[name] || 0) + 1;
        });

        const stats = Object.entries(frequencyMap).map(([name, frequency]) => ({
          name,
          frequency,
        }));

        setSymptomStats(stats);
      } catch (error) {
        console.error("Erro ao buscar sintomas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  const barData = symptomStats.map((item) => ({
    value: item.frequency,
    label: item.name,
    frontColor: "#7E22CE",
    spacing: 36,
    labelTextStyle: { color: Colors.light.text, fontSize: 10, marginTop: 6 },
  }));

  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Frequência de Sintomas
      </ThemedText>

      {loading ? (
        <Text style={{ textAlign: "center" }}>Carregando...</Text>
      ) : symptomStats.length === 0 ? (
        <Text style={{ textAlign: "center" }}>
          Nenhum sintoma registrado ainda.
        </Text>
      ) : (
        <BarChart
          data={barData}
          barWidth={24}
          noOfSections={4}
          yAxisThickness={2}
          xAxisThickness={2}
          barBorderRadius={6}
          isAnimated
          hideRules
          maxValue={Math.max(...barData.map((d) => d.value)) + 1}
          height={200}
          horizontalRulesStyle={{ opacity: 0.1 }}
          yAxisTextStyle={{ color: Colors.light.text }}
        />
      )}
      <ThemedText type="title" style={styles.subtitle}>
        Ver Detalhes
      </ThemedText>

      <FlatList
        scrollEnabled={false}
        data={symptomStats}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.symptomButton}
            onPress={() =>
              router.push({
                pathname: "/symptomDetail/[name]",
                params: { name: item.name },
              })
            }
          >
            <Ionicons name="bar-chart-outline" size={20} color="#fff" />
            <ThemedText style={styles.symptomText}>{item.name}</ThemedText>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5FF",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    marginVertical: 16,
    color: Colors.light.title,
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 16,
    color: Colors.light.subtitleDark,
  },
  symptomButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.subtitle,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  symptomText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
});
