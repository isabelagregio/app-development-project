import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Colors } from "@/components/ui/colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cancerType, setCancerType] = useState("");
  const [diagnosisDate, setDiagnosisDate] = useState("");

  const API_URL = "http://192.168.15.119:3000/users";

  function formatDateToISO(dateStr: string) {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  }

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          birthday: formatDateToISO(birthDate),
          phone,
          disease: cancerType,
          diagnosisDate: formatDateToISO(diagnosisDate),
          username: user,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário.");
      }

      const data = await response.json();
      alert(`Usuário ${data.name} cadastrado com sucesso!`);
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar. Verifique os dados e tente novamente.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/login")}
        >
          <MaterialIcons name="arrow-back" size={24} color="#4C1D95" />
        </TouchableOpacity>
        <ThemedText
          type="title"
          style={{
            marginBottom: 24,
            marginTop: 48,
            color: Colors.light.title,
            fontFamily: "PlayfairDisplay_400Regular",
          }}
        >
          Criar conta
        </ThemedText>

        <View style={styles.labelContainer}>
          <MaterialIcons name="person" size={16} color="#4C1D95" />
          <ThemedText type="subtitle" style={styles.label}>
            Nome completo
          </ThemedText>
        </View>
        <TextInput
          placeholder="Digite seu nome completo"
          placeholderTextColor="#888"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <View style={styles.labelContainer}>
          <MaterialIcons name="email" size={16} color="#4C1D95" />
          <ThemedText type="subtitle" style={styles.label}>
            Email
          </ThemedText>
        </View>
        <TextInput
          placeholder="Digite seu email"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.labelContainer}>
          <MaterialIcons name="phone" size={16} color="#4C1D95" />
          <ThemedText type="subtitle" style={styles.label}>
            Telefone
          </ThemedText>
        </View>
        <TextInput
          placeholder="Digite seu telefone"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <View style={styles.labelContainer}>
          <MaterialIcons name="calendar-today" size={16} color="#4C1D95" />
          <ThemedText type="subtitle" style={styles.label}>
            Data de nascimento
          </ThemedText>
        </View>
        <TextInput
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#888"
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <View style={styles.labelContainer}>
          <MaterialIcons name="local-hospital" size={16} color="#4C1D95" />
          <ThemedText type="subtitle" style={styles.label}>
            Tipo de câncer
          </ThemedText>
        </View>
        <TextInput
          placeholder="Digite o tipo de câncer"
          placeholderTextColor="#888"
          style={styles.input}
          value={cancerType}
          onChangeText={setCancerType}
        />

        <View style={styles.labelContainer}>
          <MaterialIcons name="event" size={16} color="#4C1D95" />
          <ThemedText type="subtitle" style={styles.label}>
            Data do diagnóstico
          </ThemedText>
        </View>
        <TextInput
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#888"
          style={styles.input}
          value={diagnosisDate}
          onChangeText={setDiagnosisDate}
        />

        <View style={styles.labelContainer}>
          <MaterialIcons name="account-circle" size={16} color="#4C1D95" />
          <ThemedText type="subtitle" style={styles.label}>
            Nome de usuário
          </ThemedText>
        </View>
        <TextInput
          placeholder="Digite o nome de usuário"
          placeholderTextColor="#888"
          style={styles.input}
          value={user}
          onChangeText={setUser}
        />

        <View style={styles.labelContainer}>
          <MaterialIcons name="lock" size={16} color="#4C1D95" />
          <ThemedText type="subtitle" style={styles.label}>
            Senha
          </ThemedText>
        </View>
        <TextInput
          placeholder="Digite a senha"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.labelContainer}>
          <MaterialIcons name="lock-outline" size={16} color="#4C1D95" />
          <ThemedText type="subtitle" style={styles.label}>
            Confirmar senha
          </ThemedText>
        </View>
        <TextInput
          placeholder="Confirme a senha"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <ThemedText type="defaultSemiBold" style={{ color: "#fff" }}>
            Registrar
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 48,
    left: 24,
    zIndex: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#F9F5FF",
  },
  scrollContent: {
    padding: 24,
    alignItems: "center",
  },
  labelContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.light.subtitleDark,
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: "#4C1D95",
    backgroundColor: "#fff",
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
});
