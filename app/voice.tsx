import { meeraTheme } from "@/src/theme/meeraTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedGlow from "@/src/components/ui/AnimatedGlow";

export default function VoiceScreen() {
  const router = useRouter();
  const [voiceState, setVoiceState] = useState<"listening" | "processing" | "speaking">("listening");
  
  useEffect(() => {
    let timeout: any;
    if (voiceState === "listening") {
      timeout = setTimeout(() => setVoiceState("processing"), 4000);
    } else if (voiceState === "processing") {
      timeout = setTimeout(() => setVoiceState("speaking"), 2000);
    }
    return () => clearTimeout(timeout);
  }, [voiceState]);

  const getStateText = () => {
    switch (voiceState) {
      case "listening": return "is listening...";
      case "processing": return "is processing...";
      case "speaking": return "is speaking...";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundContainer}>
        <AnimatedGlow size={voiceState === "speaking" ? 400 : 300} style={styles.centerGlow} color="rgba(42,231,161,0.2)" />
      </View>

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={28} color={meeraTheme.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Chatpodia</Text>
        <View style={{ width: 44 }} /> {/* Balance for back button */}
      </View>

      <View style={styles.languagePillWrap}>
        <View style={styles.languagePill}>
          <Text style={styles.languagePillText}>🌐 Auto: En → Hi</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* The overlapping circles simulating a soft wave/orb */}
        <View style={styles.orbContainer}>
          <AnimatedGlow size={180} color="#1FC484" style={{ position: 'absolute' }} />
          <View style={styles.orbWave} />
        </View>
        <Text style={styles.listeningText}>
          <Text style={styles.highlightText}>Podia</Text> {getStateText()}
        </Text>

        {voiceState === "listening" && (
          <Text style={styles.transcriptionPlaceholder}>
            "I'll play my best playlist to accompany me while..."
          </Text>
        )}
        {voiceState === "speaking" && (
          <Text style={styles.transcriptionPlaceholder}>
            "Here is a great motivational playlist for your studies!"
          </Text>
        )}
      </View>

      <View style={styles.bottomControls}>
        <Pressable onPress={() => setVoiceState("listening")}>
          <MaterialIcons name="refresh" size={28} color={meeraTheme.textMuted} />
        </Pressable>
        
        <Pressable 
          style={styles.micButton}
          onPress={() => {
             router.replace("/explore");
          }}
        >
          {voiceState === "speaking" ? (
             <MaterialIcons name="stop" size={36} color={meeraTheme.textDark} />
          ) : (
             <MaterialIcons name="keyboard-voice" size={32} color={meeraTheme.textDark} />
          )}
        </Pressable>
        
        <Pressable onPress={() => router.replace("/explore")}>
          <MaterialIcons name="keyboard" size={28} color={meeraTheme.textMuted} />
        </Pressable>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    overflow: "hidden",
  },
  centerGlow: {
    width: 300,
    height: 300,
    backgroundColor: "rgba(42,231,161,0.15)", // Emerald green glow
    borderRadius: 150,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: meeraTheme.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: meeraTheme.borderSoft,
  },
  headerTitle: {
    color: meeraTheme.white,
    fontSize: 18,
    fontWeight: "700",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    gap: 20,
  },
  orbContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: meeraTheme.green,
  },
  orbBase: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  orbWave: {
    padding: 20,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#50FFE2", // Cyan wave part
    top: 90,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    opacity: 0.9,
  },
  listeningText: {
    color: meeraTheme.textMuted,
    fontSize: 16,
    marginTop: 20,
    fontWeight: "500",
  },
  highlightText: {
    color: meeraTheme.white,
    fontWeight: "700",
  },
  transcriptionPlaceholder: {
    color: meeraTheme.white,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 30,
    marginTop: 20,
  },
  bottomControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    paddingBottom: 50,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: meeraTheme.purple, // which is Emerald
    alignItems: "center",
    justifyContent: "center",
    shadowColor: meeraTheme.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  languagePillWrap: {
    alignItems: "center",
    marginTop: 10,
  },
  languagePill: {
    backgroundColor: meeraTheme.surfaceAlt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: meeraTheme.borderSoft,
  },
  languagePillText: {
    color: meeraTheme.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
});
