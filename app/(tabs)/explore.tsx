import Avatar from "@/src/components/avatar/avatar";
import { getVoiceApiUrl, voiceApiConfig } from "@/src/config/voice";
import { useVoiceAssistant } from "@/src/hooks/useVoiceAssistant";
import { meeraShadows, meeraTheme } from "@/src/theme/meeraTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const statusCopy = {
  idle: "Press record and start talking",
  recording: "Capturing voice input",
  uploading: "Sending request to /voice",
  playing: "Assistant is speaking back",
  error: "Needs attention",
} as const;

export default function ExploreScreen() {
  const assistant = useVoiceAssistant();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <View style={[styles.glow, styles.leftGlow]} />
        <View style={[styles.glow, styles.rightGlow]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Talk Studio</Text>
            <Text style={styles.headerSubtitle}>
              Voice capture, transcript, and playback in one flow.
            </Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {voiceApiConfig.useMock ? "Mock Mode" : "Live Mode"}
            </Text>
          </View>
        </View>

        <View style={styles.consoleCard}>
          <View style={styles.consoleGlow} />
          <View style={styles.consoleScreen}>
            <Avatar
              width={220}
              height={220}
              isSpeaking={assistant.isAvatarSpeaking}
              emotion={assistant.emotion}
            />
          </View>

          <View style={styles.consoleStatusRow}>
            <Text style={styles.consoleStatus}>{statusCopy[assistant.status]}</Text>
            <View style={styles.statusDot} />
          </View>

          <View style={styles.consoleButtons}>
            <Pressable
              style={[
                styles.recordButton,
                assistant.isRecording && styles.recordButtonActive,
              ]}
              onPress={() => void assistant.toggleRecording()}
            >
              <MaterialIcons
                color={meeraTheme.white}
                name={assistant.isRecording ? "stop" : "keyboard-voice"}
                size={24}
              />
            </Pressable>

            <Pressable
              style={styles.roundControl}
              onPress={() =>
                void (assistant.isPlaying
                  ? assistant.stopPlayback()
                  : assistant.replay())
              }
            >
              <MaterialIcons
                color={meeraTheme.white}
                name={assistant.isPlaying ? "stop-circle" : "play-circle-outline"}
                size={22}
              />
            </Pressable>

            <View style={styles.roundControl}>
              <MaterialIcons color={meeraTheme.white} name="tune" size={22} />
            </View>
          </View>
        </View>

        <View style={styles.infoPanel}>
          <Text style={styles.panelTitle}>Transcript</Text>
          <Text style={styles.panelBody}>
            {assistant.transcript || "Recorded speech will appear here."}
          </Text>
        </View>

        <View style={styles.infoPanel}>
          <Text style={styles.panelTitle}>Assistant Reply</Text>
          <Text style={styles.panelBody}>
            {assistant.replyText || "The generated assistant response will appear here."}
          </Text>
        </View>

        <View style={styles.apiCard}>
          <Text style={styles.apiLabel}>API Endpoint</Text>
          <Text style={styles.apiValue}>{getVoiceApiUrl()}</Text>
          <Text style={styles.apiLabel}>Current State</Text>
          <Text style={styles.apiValue}>
            Frontend flow only. Backend can be swapped later.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: meeraTheme.background,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: meeraTheme.background,
  },
  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  leftGlow: {
    top: 130,
    left: -80,
    backgroundColor: meeraTheme.glowOrange,
  },
  rightGlow: {
    top: 180,
    right: -90,
    backgroundColor: meeraTheme.glowBlue,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 120,
    gap: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerTitle: {
    color: meeraTheme.white,
    fontSize: 28,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: meeraTheme.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: meeraTheme.border,
    backgroundColor: meeraTheme.cardMuted,
  },
  pillText: {
    color: meeraTheme.white,
    fontSize: 12,
    fontWeight: "700",
  },
  consoleCard: {
    borderRadius: 34,
    backgroundColor: "#0F0913",
    borderWidth: 1,
    borderColor: meeraTheme.border,
    padding: 18,
    ...meeraShadows.soft,
  },
  consoleGlow: {
    position: "absolute",
    top: 70,
    left: 42,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: meeraTheme.glowPurple,
  },
  consoleScreen: {
    minHeight: 270,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "#1E1822",
    alignItems: "center",
    justifyContent: "center",
    ...meeraShadows.glowBlue,
  },
  consoleStatusRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  consoleStatus: {
    color: meeraTheme.white,
    fontSize: 18,
    fontWeight: "700",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: meeraTheme.green,
  },
  consoleButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 20,
  },
  recordButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: meeraTheme.purple,
    alignItems: "center",
    justifyContent: "center",
    ...meeraShadows.glowPurple,
  },
  recordButtonActive: {
    backgroundColor: meeraTheme.red,
  },
  roundControl: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: meeraTheme.border,
    alignItems: "center",
    justifyContent: "center",
  },
  infoPanel: {
    borderRadius: 24,
    backgroundColor: meeraTheme.surface,
    borderWidth: 1,
    borderColor: meeraTheme.borderSoft,
    padding: 18,
  },
  panelTitle: {
    color: meeraTheme.white,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  panelBody: {
    color: meeraTheme.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  apiCard: {
    borderRadius: 24,
    backgroundColor: meeraTheme.surfaceAlt,
    borderWidth: 1,
    borderColor: "rgba(177,13,255,0.25)",
    padding: 18,
    gap: 8,
  },
  apiLabel: {
    color: "#DDBDFF",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  apiValue: {
    color: meeraTheme.white,
    fontSize: 14,
    lineHeight: 21,
  },
});
