import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/components/ui/colors";
import { BarChart } from "react-native-gifted-charts";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useUser } from "../context/UserContext";
import Constants from "expo-constants";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

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
    spacing: 32,
    labelTextStyle: {
      color: Colors.light.text,
      fontSize: 11,
      fontFamily: "System",
      marginTop: 6,
    },
  }));

  const maxValue = Math.max(...barData.map((d) => d.value), 0);
  const noOfSections = 4;

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
        <View style={styles.chartWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 30 }}
          >
            <BarChart
              data={barData}
              barWidth={26}
              barBorderRadius={12}
              maxValue={maxValue + 1}
              height={220}
              noOfSections={noOfSections}
              frontColor="#7E22CE"
              isAnimated
              xAxisLabelTextStyle={{
                transform: [{ rotate: "-35deg" }],
                textAlign: "right",
                fontSize: 11,
                fontFamily: "Inter_400Regular",
                color: Colors.light.subtitle,
              }}
              yAxisTextStyle={{
                color: Colors.light.subtitle,
                fontSize: 12,
                fontFamily: "Inter_400Regular",
              }}
              xAxisThickness={0}
              yAxisThickness={0}
              hideYAxisText
              rulesColor="rgba(0,0,0,0.05)"
              spacing={32}
            />
          </ScrollView>
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
    backgroundColor: "#FFFF",
    paddingHorizontal: 24,
  },
  centeredText: {
    textAlign: "center",
    marginVertical: 20,
    color: Colors.light.subtitle,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  title: {
    fontSize: 22,
    marginVertical: 16,
    color: Colors.light.title,
    fontFamily: "Inter_400Regular",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 20,
    color: Colors.light.subtitleDark,
    fontFamily: "Inter_400Regular",
    fontWeight: "600",
  },
  chartWrapper: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
  },
  arrowHint: {
    alignItems: "center",
    marginTop: 8,
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
    borderRadius: 12,
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
    fontFamily: "Inter_400Regular",
  },
});
