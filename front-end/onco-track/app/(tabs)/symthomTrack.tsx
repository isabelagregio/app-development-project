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
import { BarChart } from "react-native-gifted-charts";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function SymthomTrackScreen() {
  const [symptomStats, setSymptomStats] = useState<
    { name: string; frequency: number }[]
  >([]);

  const { user } = useUser();
  const userId = user.userId;

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchSymptoms = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/symptoms/${userId}`);
          const data = await response.json();

          const frequencyMap: Record<string, number> = {};
          data.forEach((symptom: any) => {
            const name = symptom.symptomOption.name;
            frequencyMap[name] = (frequencyMap[name] || 0) + 1;
          });

          const stats = Object.entries(frequencyMap).map(
            ([name, frequency]) => ({
              name,
              frequency,
            })
          );

          setSymptomStats(stats);
        } catch (error) {
          console.error("Erro ao buscar sintomas:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSymptoms();
    }, [userId])
  );

  const barData = symptomStats.map((item) => ({
    value: item.frequency,
    label: item.name,
    frontColor: "#7E22CE",
    spacing: 36,
    labelTextStyle: { color: Colors.light.text, fontSize: 10, marginTop: 6 },
  }));

  const maxValue = Math.max(...barData.map((d) => d.value));
  const noOfSections = 4;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <ThemedText type="title" style={styles.title}>
        Histórico de sintomas
      </ThemedText>

      <View style={styles.detailsHeader}>
        <MaterialCommunityIcons name="chart-bar" size={28} color="#7E22CE" />
        <ThemedText type="title" style={styles.subtitle}>
          Frequência
        </ThemedText>
      </View>
      {loading ? (
        <Text style={styles.centeredText}>Carregando...</Text>
      ) : symptomStats.length === 0 ? (
        <Text style={styles.centeredText}>
          Nenhum sintoma registrado ainda.
        </Text>
      ) : (
        <View style={styles.card}>
          <BarChart
            data={barData}
            barWidth={24}
            barBorderRadius={10}
            maxValue={maxValue + 1}
            height={220}
            noOfSections={noOfSections}
            frontColor="#7E22CE"
            isAnimated
            xAxisLabelTextStyle={{
              transform: [{ rotate: "-45deg" }],
              textAlign: "right",
              fontSize: 3,
              color: Colors.light.text,
            }}
            yAxisTextStyle={{
              color: Colors.light.text,
              fontSize: 12,
            }}
            xAxisThickness={1}
            yAxisThickness={0.5}
            horizontalRulesStyle={{ opacity: 1 }}
            hideYAxisText={true}
            spacing={30}
          />
        </View>
      )}

      <View style={styles.detailsHeader}>
        <MaterialCommunityIcons name="magnify" size={28} color="#7E22CE" />
        <ThemedText type="title" style={styles.subtitle}>
          Ver Detalhes
        </ThemedText>
      </View>

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
            <Ionicons name="bar-chart-outline" size={20} color="#C084FC" />
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
  centeredText: {
    textAlign: "center",
    marginVertical: 20,
    color: Colors.light.subtitle,
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    marginVertical: 16,
    color: Colors.light.title,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.light.subtitleDark,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#F3E8FF",
    borderRadius: 20,
    paddingBottom: 16,
    paddingLeft: 4,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  symptomButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  symptomText: {
    color: Colors.light.subtitleDark,
    marginLeft: 12,
    fontSize: 16,
  },
});
