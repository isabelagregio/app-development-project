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

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();

  const API_URL = "http://192.168.15.119:3000/login";

  const handleLogin = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Erro ao fazer login.");
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
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <ThemedText type="button" style={styles.buttonText}>
          Entrar
        </ThemedText>
      </TouchableOpacity>

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
});
