import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import { useUser } from "./context/UserContext";
import Constants from "expo-constants";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useUser();

  const API_URL = Constants.expoConfig?.extra?.API_URL;

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Erro ao fazer login.");
        return;
      }

      const data = await response.json();

      setUser({ userId: Number(data.id), name: data.name });
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("@/assets/images/oncotrack-purple.png")}
        style={styles.logo}
      />

      <View style={styles.inputContainer}>
        <MaterialIcons
          name="person"
          size={22}
          color="#6D28D9"
          style={styles.icon}
        />
        <TextInput
          placeholder="Digite seu nome de usuário"
          placeholderTextColor="#9CA3AF"
          style={[styles.input, { fontFamily: "Inter_400Regular" }]}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons
          name="lock"
          size={22}
          color="#6D28D9"
          style={styles.icon}
        />
        <TextInput
          placeholder="Digite sua senha"
          placeholderTextColor="#9CA3AF"
          style={[styles.input, { fontFamily: "Inter_400Regular" }]}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={22}
            color="#6D28D9"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <ThemedText
          type="button"
          style={[styles.buttonText, { fontFamily: "Inter_600SemiBold" }]}
        >
          Entrar
        </ThemedText>
      </TouchableOpacity>

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <MaterialIcons
            name="error-outline"
            size={20}
            color="#fff"
            style={styles.errorIcon}
          />
          <ThemedText
            style={[styles.errorText, { fontFamily: "Inter_400Regular" }]}
          >
            {errorMessage}
          </ThemedText>
        </View>
      ) : null}

      <ThemedText
        style={[styles.registerPrompt, { fontFamily: "Inter_400Regular" }]}
      >
        Ainda não tem uma conta?{" "}
        <ThemedText
          type="button"
          style={[styles.registerLink, { fontFamily: "Inter_600SemiBold" }]}
          onPress={() => router.push("/register")}
        >
          Cadastre-se
        </ThemedText>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB", // fundo mais claro
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#374151",
    paddingRight: 8,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 52,
    backgroundColor: "#6D28D9", // roxo principal
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  registerPrompt: {
    color: "#4B5563",
    fontSize: 14,
    textAlign: "center",
  },
  registerLink: {
    color: "#6D28D9",
    textDecorationLine: "underline",
  },
  errorContainer: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    width: "100%",
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: "#fff",
    fontSize: 14,
    flexShrink: 1,
  },
});
