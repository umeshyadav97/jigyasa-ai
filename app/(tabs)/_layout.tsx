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
        tabBarShowLabel: true,
        tabBarActiveTintColor: meeraTheme.white,
        tabBarInactiveTintColor: meeraTheme.textMuted,
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 14,
          height: 74,
          borderRadius: 28,
          borderTopWidth: 0,
          backgroundColor: "rgba(20,12,26,0.94)",
          shadowColor: "#000000",
          shadowOpacity: 0.45,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 12 },
          elevation: 14,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          paddingBottom: 6,
        },
        tabBarItemStyle: {
          paddingTop: 8,
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
