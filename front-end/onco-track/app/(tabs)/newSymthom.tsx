import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/components/ui/colors";
import { router } from "expo-router";
import { useUser } from "../context/UserContext";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

function IntensityBar({
  level,
  onChange,
}: {
  level: number;
  onChange: (n: number) => void;
}) {
  return (
    <View style={styles.barContainer}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <TouchableOpacity
          key={i}
          onPress={() => onChange(i)}
          style={[
            styles.barSegment,
            { backgroundColor: i <= level ? "#7E22CE" : "#E9D5FF" },
          ]}
        />
      ))}
    </View>
  );
}

export default function SymptomScreen() {
  const { user } = useUser();
  const userId = user.userId;
  const [symptomOptions, setSymptomOptions] = useState<string[]>([]);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [showNewSymptomInput, setShowNewSymptomInput] = useState(false);
  const [newSymptom, setNewSymptom] = useState("");
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchSymptomOptions();
  }, []);

  const fetchSymptomOptions = async () => {
    try {
      const response = await fetch(`${API_URL}/symptoms/options/${userId}`);
      const data = await response.json();
      const names = data.map((opt: any) => opt.name);
      setSymptomOptions(names);
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
    }
  };

  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptom(symptom);
  };

  const handleAddNewSymptom = async () => {
    if (!newSymptom.trim()) return;

    try {
      const response = await fetch(`${API_URL}/symptoms/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSymptom.trim(), userId }),
      });

      if (!response.ok) throw new Error("Erro ao criar opção");

      await fetchSymptomOptions();
      setSelectedSymptom(newSymptom.trim());
      setNewSymptom("");
      setShowNewSymptomInput(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível adicionar o sintoma.");
    }
  };

  const handleSaveSymptom = async () => {
    if (!selectedSymptom) {
      Alert.alert("Atenção", "Selecione um sintoma.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/symptoms/options/${userId}`);
      const data = await response.json();
      const option = data.find((o: any) => o.name === selectedSymptom);

      if (!option) {
        Alert.alert("Erro", "Opção de sintoma não encontrada.");
        return;
      }

      await fetch(`${API_URL}/symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          symptomOptionId: option.id,
          severity: intensity,
          note,
        }),
      });

      Alert.alert("Sucesso", "Sintoma salvo com sucesso!");
      setSelectedSymptom(null);
      setNote("");
      setIntensity(3);
      router.push("/home");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o sintoma.");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F9F5FF" }}
      contentContainerStyle={{
        ...styles.container,
        flexGrow: 1,
        paddingBottom: 32,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedText type="title" style={styles.title}>
        O que estou sentindo?
      </ThemedText>

      {symptomOptions.map((symptom) => (
        <TouchableOpacity
          key={symptom}
          style={styles.radioItem}
          onPress={() => handleSymptomSelect(symptom)}
        >
          <View
            style={[
              styles.radioCircle,
              selectedSymptom === symptom && styles.radioCircleSelected,
            ]}
          />
          <ThemedText style={styles.symptomLabel}>{symptom}</ThemedText>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.newSymptomButton}
        onPress={() => setShowNewSymptomInput(!showNewSymptomInput)}
      >
        <Ionicons
          name="add-circle-outline"
          size={18}
          color="#7E22CE"
          style={{ marginRight: 4 }}
        />
        <ThemedText style={styles.newSymptomText}>Novo sintoma</ThemedText>
      </TouchableOpacity>

      {showNewSymptomInput && (
        <View style={styles.newSymptomCard}>
          <ThemedText style={styles.inputLabel}>Nome do sintoma</ThemedText>
          <TextInput
            style={styles.textInput}
            value={newSymptom}
            onChangeText={setNewSymptom}
            placeholder="Digite o nome do sintoma"
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddNewSymptom}
          >
            <ThemedText style={styles.saveButtonText}>Salvar opção</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <ThemedText type="title" style={styles.title}>
        Intensidade
      </ThemedText>
      <IntensityBar level={intensity} onChange={setIntensity} />

      <ThemedText type="title" style={styles.title}>
        Descrição
      </ThemedText>
      <TextInput
        style={[styles.textInput, { height: 80, textAlignVertical: "top" }]}
        value={note}
        onChangeText={setNote}
        multiline
        placeholder="Descreva o sintoma ou situação"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSymptom}>
        <ThemedText style={styles.saveButtonText}>Salvar sintoma</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F5FF",
    padding: 24,
  },
  title: {
    fontSize: 20,
    color: Colors.light.title,
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7E22CE",
    marginRight: 8,
  },
  radioCircleSelected: {
    backgroundColor: "#7E22CE",
  },
  symptomLabel: {
    fontSize: 17,
    color: Colors.light.text,
  },
  newSymptomButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  newSymptomText: {
    color: "#7E22CE",
    fontSize: 14,
  },
  newSymptomCard: {
    backgroundColor: "#EDE9FE",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.light.subtitleDark,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D8B4FE",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: Colors.light.button,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  barContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 24,
  },
  barSegment: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
});
