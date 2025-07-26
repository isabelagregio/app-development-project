import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/components/ui/colors";
import { PieChart } from "react-native-chart-kit";
import { useUser } from "../context/UserContext";
import { useFocusEffect } from "expo-router";

const screenWidth = Dimensions.get("window").width;
const API_URL = "http://192.168.15.119:3000";

const moodColors: Record<string, string> = {
  Animado: "#C084FC",
  Feliz: "#8b69f3",
  Calmo: "#93C5FD",
  Triste: "#60A5FA",
  Estressado: "#6366F1",
  Horrível: "#6B7280",
};

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

        const chartData = Object.keys(moodCount).map((label) => ({
          name: label,
          population: moodCount[label],
          color: moodColors[label] || "#D1D5DB",
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Frequência de Humores
      </ThemedText>

      {moodData.length > 0 ? (
        <>
          <PieChart
            data={moodData.map(({ name, color }) => ({
              name,
              population: 1,
              color,
              legendFontColor: "#4C1D95",
              legendFontSize: 14,
            }))}
            width={screenWidth - 40}
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

          <ThemedText type="subtitle" style={styles.predominantText}>
            Seu humor predominante é:{" "}
            <ThemedText style={styles.boldText}>{predominantMood}</ThemedText>
          </ThemedText>

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Percentual de humores
          </ThemedText>

          <View style={styles.barWrapper}>
            <ThemedText style={styles.barLabel}>
              Positivos: {positivePercentage}%
            </ThemedText>
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
            <ThemedText style={styles.barLabel}>
              Negativos: {negativePercentage}%
            </ThemedText>
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
    flex: 1,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: Colors.light.title,
  },
  predominantText: {
    fontSize: 16,
    marginTop: 20,
    color: Colors.light.subtitleDark,
    textAlign: "center",
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
  barLabel: {
    fontSize: 14,
    marginBottom: 4,
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
