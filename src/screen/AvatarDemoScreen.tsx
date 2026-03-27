// ─── AVATAR DEMO SCREEN ───────────────────────────────────────────────────────
// Test screen with sliders to drive every morph parameter manually.
// Use this to tune the avatar before wiring up voice analysis.

import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Avatar } from "../components/avatar/avatar";
import {
  DEFAULT_MORPH,
  EXPRESSIONS,
  ExpressionName,
  MorphState,
} from "../components/avatar/avatar.types";

// ─────────────────────────────────────────────────────────────────────────────

const MORPH_GROUPS = [
  {
    label: "MOUTH",
    keys: [
      "jawOpen",
      "lipWide",
      "lipRound",
      "lipTight",
      "teethShow",
      "tongueShow",
    ],
  },
  {
    label: "SMILE",
    keys: ["smileL", "smileR", "cheekRaise"],
  },
  {
    label: "EYES",
    keys: ["blinkL", "blinkR", "squintL", "squintR", "eyeGazeX", "eyeGazeY"],
  },
  {
    label: "BROWS",
    keys: ["browRaiseL", "browRaiseR", "browFurrowL", "browFurrowR"],
  },
];

const EXPRESSION_LIST: ExpressionName[] = [
  "neutral",
  "happy",
  "thinking",
  "surprised",
  "concerned",
  "talking",
];

// ─────────────────────────────────────────────────────────────────────────────

export const AvatarDemoScreen = () => {
  const [morph, setMorph] = useState<Partial<MorphState>>({});
  const [speakingPreview, setSpeakingPreview] = useState(false);
  const [preset, setPreset] = useState<"default_female" | "default_male">(
    "default_female",
  );
  const [activeExpression, setActiveExpression] =
    useState<ExpressionName | null>("neutral");

  const setMorphKey = (key: keyof MorphState, value: number) => {
    setMorph((prev) => ({ ...prev, [key]: value }));
    setActiveExpression(null);
  };

  const applyExpression = (name: ExpressionName) => {
    setActiveExpression(name);
    setMorph(EXPRESSIONS[name]);
  };

  const resetMorph = () => {
    setMorph({});
    setActiveExpression("neutral");
  };

  const currentMorph = { ...DEFAULT_MORPH, ...morph };

  return (
    <View style={styles.root}>
      {/* ── Avatar canvas ── */}
      <View style={styles.canvasArea}>
        <Avatar
          preset={preset}
          morph={morph}
          width={280}
          height={360}
          isSpeaking={speakingPreview}
          emotion={activeExpression === "happy" ? "happy" : "neutral"}
        />
      </View>

      {/* ── Controls ── */}
      <ScrollView
        style={styles.controls}
        contentContainerStyle={styles.controlsContent}
      >
        {/* Preset switcher */}
        <View style={styles.row}>
          <Text style={styles.sectionLabel}>AVATAR PRESET</Text>
          <View style={styles.btnRow}>
            {(["default_female", "default_male"] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.btn, preset === p && styles.btnActive]}
                onPress={() => setPreset(p)}
              >
                <Text
                  style={[styles.btnText, preset === p && styles.btnTextActive]}
                >
                  {p === "default_female" ? "Female" : "Male"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Speaking preview toggle */}
        <View style={styles.row}>
          <Text style={styles.sectionLabel}>SPEAKING PREVIEW</Text>
          <Switch
            value={speakingPreview}
            onValueChange={setSpeakingPreview}
            trackColor={{ true: "#4ECDC4", false: "#333" }}
            thumbColor={speakingPreview ? "#fff" : "#888"}
          />
        </View>

        {/* Expression presets */}
        <Text style={styles.sectionLabel}>EXPRESSION PRESETS</Text>
        <View style={styles.btnRow}>
          {EXPRESSION_LIST.map((name) => (
            <TouchableOpacity
              key={name}
              style={[
                styles.exprBtn,
                activeExpression === name && styles.exprBtnActive,
              ]}
              onPress={() => applyExpression(name)}
            >
              <Text
                style={[
                  styles.exprBtnText,
                  activeExpression === name && styles.exprBtnTextActive,
                ]}
              >
                {name}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.exprBtn} onPress={resetMorph}>
            <Text style={styles.exprBtnText}>reset</Text>
          </TouchableOpacity>
        </View>

        {/* Morph sliders */}
        {MORPH_GROUPS.map((group) => (
          <View key={group.label}>
            <Text style={styles.sectionLabel}>{group.label}</Text>
            {group.keys.map((key) => {
              const k = key as keyof MorphState;
              const val = currentMorph[k] ?? 0;
              const isGaze =
                key.startsWith("eyeGaze") || key.startsWith("headTilt");
              const min = isGaze ? -1 : 0;
              return (
                <View key={key} style={styles.sliderRow}>
                  <Text style={styles.sliderLabel}>{key}</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={min}
                    maximumValue={1}
                    value={val}
                    onValueChange={(v) => setMorphKey(k, v)}
                    minimumTrackTintColor="#4ECDC4"
                    maximumTrackTintColor="#333"
                    thumbTintColor="#4ECDC4"
                  />
                  <Text style={styles.sliderValue}>{val.toFixed(2)}</Text>
                </View>
              );
            })}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0D0F12",
    flexDirection: "row",
  },
  canvasArea: {
    width: 290,
    backgroundColor: "#111418",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#1E2228",
  },
  controls: {
    flex: 1,
    backgroundColor: "#0D0F12",
  },
  controlsContent: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionLabel: {
    color: "#4ECDC4",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 12,
    marginBottom: 8,
  },
  btnRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  btn: {
    borderWidth: 1,
    borderColor: "#2E3238",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnActive: {
    borderColor: "#4ECDC4",
    backgroundColor: "rgba(78,205,196,0.1)",
  },
  btnText: {
    color: "#888",
    fontSize: 12,
  },
  btnTextActive: {
    color: "#4ECDC4",
  },
  exprBtn: {
    borderWidth: 1,
    borderColor: "#2E3238",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 4,
  },
  exprBtnActive: {
    borderColor: "#FF6B6B",
    backgroundColor: "rgba(255,107,107,0.1)",
  },
  exprBtnText: {
    color: "#666",
    fontSize: 11,
  },
  exprBtnTextActive: {
    color: "#FF6B6B",
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  sliderLabel: {
    color: "#666",
    fontSize: 10,
    width: 90,
    letterSpacing: 0.3,
  },
  slider: {
    flex: 1,
    height: 30,
  },
  sliderValue: {
    color: "#888",
    fontSize: 10,
    width: 32,
    textAlign: "right",
  },
});
