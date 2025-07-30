import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/components/ui/colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useUser } from "../context/UserContext";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  disease: string;
  diagnosisDate: string;
  username: string;
}

export default function ProfileScreen() {
  const { user } = useUser();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = Constants.expoConfig?.extra?.API_URL;
  const userId = user?.userId;

  useEffect(() => {
    async function fetchUserById() {
      if (!userId) return;

      try {
        const res = await fetch(`${API_URL}/users/${userId}`);
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserById();
  }, [userId]);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
  }

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </ThemedView>
    );
  }

  if (!userData) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Usuário não encontrado.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Meu Perfil
      </ThemedText>

      <View style={styles.card}>
        <ProfileItem
          label="Nome completo"
          value={userData.name}
          icon="person"
        />
        <ProfileItem
          label="Nome de usuário"
          value={userData.username}
          icon="account-circle"
        />
        <ProfileItem label="Email" value={userData.email} icon="email" />
        <ProfileItem label="Telefone" value={userData.phone} icon="phone" />
        <ProfileItem
          label="Data de nascimento"
          value={formatDate(userData.birthday)}
          icon="calendar-today"
        />
        <ProfileItem
          label="Tipo de câncer"
          value={userData.disease}
          icon="local-hospital"
        />
        <ProfileItem
          label="Data do diagnóstico"
          value={formatDate(userData.diagnosisDate)}
          icon="event"
        />
      </View>
    </ScrollView>
  );
}

function ProfileItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}) {
  return (
    <View style={styles.item}>
      <MaterialIcons name={icon} size={20} color="#7C3AED" />
      <View style={styles.itemTextWrapper}>
        <ThemedText type="subtitle" style={styles.label}>
          {label}
        </ThemedText>
        <ThemedText style={styles.value}>{value}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9F5FF",
  },
  title: {
    fontFamily: "PlayfairDisplay_400Regular",
    fontSize: 24,
    color: Colors.light.title,
    textAlign: "center",
    marginBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  itemTextWrapper: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: Colors.light.subtitleDark,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: "#4C1D95",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F5FF",
  },
});
