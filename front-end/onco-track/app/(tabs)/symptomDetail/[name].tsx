import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/components/ui/colors";
import { LineChart } from "react-native-gifted-charts";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

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

export default function SymptomDetailScreen() {
  const { user } = useUser();
  const userId = user.userId;
  const { name } = useLocalSearchParams();
  const [symptomHistory, setSymptomHistory] = useState<
    {
      date: string;
      intensity: number;
      id: string;
      note?: string;
      symptomOption: any;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await fetch(`${API_URL}/symptoms/${userId}`);
        const data = await response.json();

        const filtered = data.filter((s: any) => s.symptomOption.name === name);

        const history = filtered.map((item: any) => ({
          id: item.id.toString(),
          date: item.createdAt.slice(0, 10),
          intensity: item.severity,
          note: item.note,
          symptomOption: item.symptomOption,
        }));

        history.sort((a: { date: string }, b: { date: string }) =>
          a.date.localeCompare(b.date)
        );
        setSymptomHistory(history);
      } catch (error) {
        console.error("Erro ao buscar detalhes do sintoma:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, [name]);

  const chartData = symptomHistory.map((item) => ({
    value: item.intensity,
    label: (() => {
      const [year, month, day] = item.date.split("-");
      return `${day}/${month}`;
    })(),
    labelTextStyle: { fontSize: 10, color: Colors.light.text },
    frontColor: "#7E22CE",
  }));

  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {name}
      </ThemedText>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.light.button}
          style={{ marginTop: 40 }}
        />
      ) : symptomHistory.length === 0 ? (
        <ThemedText style={{ textAlign: "center", marginTop: 40 }}>
          Nenhum registro encontrado para este sintoma.
        </ThemedText>
      ) : (
        <>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Intensidade ao longo do tempo
          </ThemedText>

          <LineChart
            data={chartData}
            height={200}
            isAnimated
            thickness={2}
            color="#7E22CE"
            hideDataPoints={false}
            areaChart
            startFillColor="#C084FC"
            endFillColor="#F3E8FF"
            noOfSections={4}
            yAxisColor="#D1D5DB"
            xAxisColor="#D1D5DB"
            yAxisTextStyle={{ color: Colors.light.text }}
            rulesType="dashed"
            rulesColor="#D1D5DB"
            maxValue={8}
            stepValue={2}
          />

          <ThemedText type="subtitle" style={styles.subtitle}>
            Histórico do sintoma
          </ThemedText>

          {symptomHistory.map((symptom) => (
            <View key={symptom.id} style={styles.symptomCard}>
              <View style={styles.cardHeader}>
                <ThemedText style={styles.symptomName}>
                  {symptom.symptomOption.name}
                </ThemedText>
                <View style={styles.dateFlag}>
                  <Text style={styles.dateFlagText}>
                    {formatDateBR(symptom.date)}
                  </Text>
                </View>
              </View>

              <View style={styles.intensity}>
                <IntensityBar level={symptom.intensity} />
              </View>

              {symptom.note && (
                <ThemedText style={styles.note}>{symptom.note}</ThemedText>
              )}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

function formatDateBR(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F5FF",
    padding: 24,
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: Colors.light.title,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.subtitleDark,
    marginTop: 16,
    marginBottom: 12,
  },
  symptomCard: {
    backgroundColor: "#EDE9FE",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  symptomName: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "bold",
  },
  dateFlag: {
    backgroundColor: "#7E22CE",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  dateFlagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  intensity: {
    marginTop: 4,
    flexDirection: "row",
  },
  note: {
    marginTop: 4,
    fontSize: 13,
    fontStyle: "italic",
    color: Colors.light.subtitleDark,
  },
  barContainer: {
    flexDirection: "row",
    gap: 2,
    marginTop: 4,
  },
  bar: {
    width: 24,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
});
