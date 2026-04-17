import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { meeraTheme } from "@/src/theme/meeraTheme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: "none", // Hide tab bar completely for Chatpodia design
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons color={color} name="home" size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Talk",
          tabBarIcon: ({ color }) => (
            <MaterialIcons color={color} name="keyboard-voice" size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
