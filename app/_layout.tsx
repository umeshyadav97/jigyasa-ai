import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { meeraTheme } from "@/src/theme/meeraTheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: meeraTheme.background,
    card: meeraTheme.surface,
    primary: meeraTheme.purple,
    text: meeraTheme.white,
    border: meeraTheme.borderSoft,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
