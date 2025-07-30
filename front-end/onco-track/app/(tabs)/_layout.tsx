import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Image, View, StyleSheet } from "react-native";
import { UserProvider } from "../context/UserContext";

function AppHeaderTitle() {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("@/assets/images/oncotrack-horizontal-logo.png")}
        style={styles.headerLogo}
        resizeMode="contain"
      />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: () => <AppHeaderTitle />,
        headerStyle: {
          backgroundColor: "#F3E8FF",
        },
        headerTitleStyle: {
          color: "#4C1D95",
          fontSize: 20,
        },
        tabBarActiveTintColor: "#7E22CE",
        tabBarInactiveTintColor: "#A78BFA",
        tabBarStyle: {
          backgroundColor: "#F3E8FF",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="symthomTrack"
        options={{
          title: "Sintomas",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="query-stats" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="moods"
        options={{
          title: "Meu humor",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="emoji-emotions" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appoitments"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="calendar-month" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-box" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="newSymthom"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="newAppoitment"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="symthomDetail"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="editAppointment"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="symptomDetail/[name]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontSize: 24,
    color: "#4C1D95",
    fontWeight: "bold",
  },
  headerLogo: {
    width: 150,
    height: 80,
  },
});
