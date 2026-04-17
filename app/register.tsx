import { meeraTheme } from "@/src/theme/meeraTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundContainer}>
        <View style={styles.topGradientGlow} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="person-add-alt-1" size={32} color={meeraTheme.purple} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Chatpodia to build your assistant</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="person-outline" size={20} color={meeraTheme.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your name"
                  placeholderTextColor={meeraTheme.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="mail-outline" size={20} color={meeraTheme.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor={meeraTheme.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock-outline" size={20} color={meeraTheme.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Create a password"
                  placeholderTextColor={meeraTheme.textMuted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? "visibility-off" : "visibility"}
                    size={20}
                    color={meeraTheme.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              style={styles.primaryButton}
              onPress={() => router.replace("/")}
            >
              <Text style={styles.primaryButtonText}>Sign Up</Text>
            </Pressable>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <Pressable style={styles.socialButton}>
              <MaterialIcons name="language" size={24} color={meeraTheme.white} />
              <Text style={styles.socialButtonText}>Google</Text>
            </Pressable>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text style={styles.footerLink}>Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: meeraTheme.background,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  topGradientGlow: {
    position: "absolute",
    top: -200,
    left: -100,
    right: -100,
    height: 500,
    backgroundColor: "rgba(42,231,161,0.15)", // Emerald green glow
    borderRadius: 300,
    transform: [{ scaleX: 1.5 }],
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(42, 231, 161, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(42, 231, 161, 0.2)",
  },
  title: {
    color: meeraTheme.white,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: meeraTheme.textMuted,
    fontSize: 14,
    marginTop: 8,
  },
  formContainer: {
    gap: 20,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    color: meeraTheme.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: meeraTheme.surfaceAlt,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
  },
  textInput: {
    flex: 1,
    color: meeraTheme.white,
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: meeraTheme.purple, // Emerald
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    shadowColor: meeraTheme.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  primaryButtonText: {
    color: meeraTheme.textDark,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: meeraTheme.borderSoft,
  },
  dividerText: {
    color: meeraTheme.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  socialContainer: {
    gap: 16,
    marginBottom: 40,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: meeraTheme.surfaceAlt,
    borderWidth: 1,
    borderColor: meeraTheme.borderSoft,
    height: 56,
    borderRadius: 20,
    gap: 12,
  },
  socialButtonText: {
    color: meeraTheme.white,
    fontSize: 15,
    fontWeight: "600",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: meeraTheme.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: meeraTheme.purple, // Emerald
    fontSize: 14,
    fontWeight: "700",
  },
});
