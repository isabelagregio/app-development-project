import React, { useCallback, useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/components/ui/colors";
import { PieChart } from "react-native-chart-kit";
import { useUser } from "../context/UserContext";
import { useFocusEffect } from "expo-router";
import Constants from "expo-constants";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;
const API_URL = Constants.expoConfig?.extra?.API_URL;

const moods = [
  { icon: "emoticon-excited-outline", label: "Animado", color: "#C084FC" },
  { icon: "emoticon-happy-outline", label: "Feliz", color: "#8b69f3" },
  { icon: "emoticon-cool-outline", label: "Calmo", color: "#93C5FD" },
  { icon: "emoticon-sad-outline", label: "Triste", color: "#60A5FA" },
  { icon: "emoticon-angry-outline", label: "Estressado", color: "#6366F1" },
  { icon: "emoticon-dead-outline", label: "Horrível", color: "#6B7280" },
] as const;

export default function MoodsScreen() {
  const { user } = useUser();
  const userId = user.userId;

  const [moodData, setMoodData] = useState<any[]>([]);
  const [predominantMood, setPredominantMood] = useState<string>("");
  const [positivePercentage, setPositivePercentage] = useState(0);
  const [negativePercentage, setNegativePercentage] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchMoodHistory();
    }, [])
  );

  const fetchMoodHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/moods/${userId}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const moodCount: Record<string, number> = {};
        data.forEach((mood: any) => {
          moodCount[mood.label] = (moodCount[mood.label] || 0) + 1;
        });

        const chartData = moods
          .filter(({ label }) => moodCount[label])
          .map(({ label, color }) => ({
            name: label,
            population: moodCount[label],
            color,
            legendFontColor: "#4C1D95",
            legendFontSize: 14,
          }));

        const sorted = Object.entries(moodCount).sort(
          (a: [string, number], b: [string, number]) => b[1] - a[1]
        );

        setPredominantMood(sorted[0]?.[0] || "");
        setMoodData(chartData);

        const positiveMoods = ["Animado", "Feliz", "Calmo"];
        const negativeMoods = ["Triste", "Estressado", "Horrível"];

        let total = 0;
        let positives = 0;
        let negatives = 0;

        Object.entries(moodCount).forEach(([label, count]) => {
          total += count;
          if (positiveMoods.includes(label)) positives += count;
          if (negativeMoods.includes(label)) negatives += count;
        });

        if (total > 0) {
          setPositivePercentage(Math.round((positives / total) * 100));
          setNegativePercentage(Math.round((negatives / total) * 100));
        }
      }
    } catch (error) {
      console.error("Erro ao buscar humores:", error);
    }
  };

  const getMoodIcon = (label: string, size = 24, color = "#4C1D95") => {
    const mood = moods.find((m) => m.label === label);
    if (!mood) return null;
    return (
      <MaterialCommunityIcons
        name={mood.icon}
        size={size}
        color={color}
        style={{ marginRight: 6, marginTop: 6 }}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Frequência de humores
      </ThemedText>

      {moodData.length > 0 ? (
        <>
          <View style={styles.card}>
            <PieChart
              data={moodData}
              width={screenWidth - 48}
              height={220}
              chartConfig={{
                color: () => "#000",
                labelColor: () => "#000",
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              hasLegend={true}
              absolute={false}
            />
          </View>

          <ThemedText type="subtitle" style={styles.predominantText}>
            Seu humor predominante é:{" "}
            {getMoodIcon(predominantMood, 26, Colors.light.title)}
            <ThemedText style={styles.boldText}>{predominantMood}</ThemedText>
          </ThemedText>

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Análise de sentimentos
          </ThemedText>

          <View style={styles.barWrapper}>
            <View style={styles.barLabelRow}>
              <MaterialIcons
                name="sentiment-very-satisfied"
                size={20}
                color="#8b69f3"
                style={{ marginRight: 6 }}
              />
              <ThemedText style={styles.barLabel}>
                Positivos: {positivePercentage}%
              </ThemedText>
            </View>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${positivePercentage}%`,
                    backgroundColor: "#8b69f3",
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.barWrapper}>
            <View style={styles.barLabelRow}>
              <MaterialIcons
                name="sentiment-very-dissatisfied"
                size={20}
                color="#6B7280"
                style={{ marginRight: 6 }}
              />
              <ThemedText style={styles.barLabel}>
                Negativos: {negativePercentage}%
              </ThemedText>
            </View>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${negativePercentage}%`,
                    backgroundColor: "#6B7280",
                  },
                ]}
              />
            </View>
          </View>
        </>
      ) : (
        <ThemedText style={styles.noData}>
          Nenhum dado disponível ainda.
        </ThemedText>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9F5FF",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: Colors.light.title,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  predominantText: {
    fontSize: 16,
    marginTop: 20,
    color: Colors.light.subtitleDark,
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  boldText: {
    fontWeight: "bold",
    color: Colors.light.title,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 30,
    marginBottom: 10,
    color: Colors.light.subtitleDark,
    fontWeight: "bold",
  },
  barWrapper: {
    width: "100%",
    marginBottom: 12,
  },
  barLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 14,
    color: Colors.light.text,
  },
  barBackground: {
    width: "100%",
    height: 20,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 10,
  },
  noData: {
    marginTop: 40,
    color: Colors.light.subtitle,
    textAlign: "center",
  },
});
