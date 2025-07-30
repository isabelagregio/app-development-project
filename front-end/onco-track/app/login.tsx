import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useState } from "react";
import { Colors } from "@/components/ui/colors";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import { useUser } from "./context/UserContext";
import Constants from "expo-constants";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useUser();

  const API_URL = Constants.expoConfig?.extra?.API_URL;

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
          size={20}
          color="#A78BFA"
          style={styles.icon}
        />
        <TextInput
          placeholder="Digite seu nome de usuário"
          placeholderTextColor="#A78BFA"
          style={styles.input}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons
          name="lock"
          size={20}
          color="#A78BFA"
          style={styles.icon}
        />
        <TextInput
          placeholder="Digite sua senha"
          placeholderTextColor="#A78BFA"
          style={styles.input}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={20}
            color="#A78BFA"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <ThemedText type="button" style={styles.buttonText}>
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
          <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
        </View>
      ) : null}

      <ThemedText style={styles.registerPrompt}>
        Ainda não tem uma conta?{" "}
        <ThemedText
          type="button"
          style={styles.registerLink}
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
    backgroundColor: Colors.light.background,
  },
  logo: {
    width: 260,
    height: 260,
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: Colors.light.link,
    paddingRight: 8,
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: Colors.light.button,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
  },
  registerPrompt: {
    color: Colors.light.link,
  },
  registerLink: {
    color: Colors.light.link,
    textDecorationLine: "underline",
  },
  errorContainer: {
    backgroundColor: "#f16161",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
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
