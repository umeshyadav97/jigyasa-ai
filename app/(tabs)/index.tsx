import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Avatar from "@/src/components/avatar/avatar";
import { meeraShadows, meeraTheme } from "@/src/theme/meeraTheme";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const topMenus = [
  "AI-ASSISTANT",
  "LIMITED EDITIONS",
  "NEXT-GEN",
  "FUTURE ASSETS",
  "MASTERPIECE",
];

const heroCards = [
  {
    id: "talk",
    title: "AI chat\nAssistant",
    description: "Chat with your AI assistant smart, fast, and always ready to help.",
    buttonLabel: "Next",
    accent: "chat" as const,
  },
  {
    id: "transcript",
    title: "Voice to\nTranscript",
    description: "Convert your voice into text instantly fast, accurate, and effortless.",
    buttonLabel: "Next",
    accent: "voice" as const,
  },
];

const avatars = [
  {
    id: "meera",
    name: "Meera",
    role: "Voice Concierge",
    emotion: "happy" as const,
    badge: "Default",
  },
  {
    id: "tara",
    name: "Tara",
    role: "Support Guide",
    emotion: "neutral" as const,
    badge: "Calm",
  },
  {
    id: "arya",
    name: "Arya",
    role: "Sales Closer",
    emotion: "happy" as const,
    badge: "Fast",
  },
];

const sideCallouts = [
  {
    id: "left-top",
    title: "DISCOVER THE AI\nASSISTANT APP",
    icon: "send" as const,
    side: "left" as const,
    top: 180,
  },
  {
    id: "left-bottom",
    title: "EXCLUSIVE AI-\nASSISTANT APP",
    icon: "shield" as const,
    side: "left" as const,
    top: 520,
  },
  {
    id: "right-top",
    title: "NEXT-GEN AI\nASSISTANT APPS",
    icon: "settings" as const,
    side: "right" as const,
    top: 182,
  },
  {
    id: "right-bottom",
    title: "TRENDING\nCOLLECTIONS",
    icon: "local-fire-department" as const,
    side: "right" as const,
    top: 520,
  },
];

const starDots = Array.from({ length: 90 }, (_, index) => ({
  id: index,
  left: `${(index * 19) % 100}%`,
  top: `${(index * 11) % 100}%`,
  opacity: 0.12 + (index % 5) * 0.12,
}));

function HeroPhoneCard({
  title,
  description,
  buttonLabel,
  accent,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  accent: "chat" | "voice";
}) {
  return (
    <View style={styles.phoneFrame}>
      <View
        style={[
          styles.heroGlow,
          accent === "chat" ? styles.heroGlowOrange : styles.heroGlowBlue,
        ]}
      />
      <View
        style={[
          styles.heroGlowSecondary,
          accent === "chat" ? styles.heroGlowBlue : styles.heroGlowPink,
        ]}
      />

      <View style={styles.phoneTopBar}>
        <Text style={styles.phoneTopText}>9:41</Text>
        <View style={styles.dynamicIsland} />
        <View style={styles.phoneStatusWrap}>
          <MaterialIcons color={meeraTheme.white} name="signal-cellular-4-bar" size={14} />
          <MaterialIcons color={meeraTheme.white} name="wifi" size={13} />
          <View style={styles.batteryWrap}>
            <Text style={styles.batteryText}>99</Text>
          </View>
        </View>
      </View>

      <View style={styles.phoneVisualArea}>
        <View
          style={[
            styles.neonPanel,
            accent === "chat" ? styles.neonPanelChat : styles.neonPanelVoice,
          ]}
        >
          {accent === "chat" ? (
            <View style={styles.chatCardShell}>
              <View style={styles.chatCardLineShort} />
              <View style={styles.chatRow}>
                <View style={styles.chatOrb} />
                <View style={styles.chatTextWrap}>
                  <View style={styles.chatLineLong} />
                  <View style={styles.chatLineMid} />
                </View>
                <View style={styles.chatAvatarBadge}>
                  <Avatar width={42} height={42} emotion="happy" isSpeaking />
                </View>
              </View>
              <View style={styles.chatRow}>
                <View style={styles.chatTextWrap}>
                  <View style={styles.chatLineMid} />
                  <View style={styles.chatLineShort} />
                </View>
                <View style={styles.chatAvatarBadge}>
                  <Avatar width={42} height={42} emotion="neutral" />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.voicePanelInner}>
              <MaterialIcons color="#FDB819" name="keyboard-voice" size={82} />
              <View style={styles.voiceLineWide} />
              <View style={styles.voiceLineWide} />
              <View style={styles.voiceLineMedium} />
              <View style={styles.voiceLineMedium} />
            </View>
          )}

          <View style={styles.neonPanelDots}>
            <View
              style={[
                styles.colorDot,
                styles.dotTopLeft,
                { backgroundColor: "#FF4D34" },
              ]}
            />
            <View
              style={[
                styles.colorDot,
                styles.dotTopRight,
                { backgroundColor: "#3F6BFF" },
              ]}
            />
            <View
              style={[
                styles.colorDot,
                styles.dotBottomLeft,
                { backgroundColor: "#F500FF" },
              ]}
            />
            <View
              style={[
                styles.colorDot,
                styles.dotBottomRight,
                { backgroundColor: "#FFBC1A" },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.whiteInfoCard}>
        <Text style={styles.whiteInfoTitle}>
          {accent === "chat" ? (
            <>
              <Text style={styles.whiteInfoAccent}>AI</Text> chat{"\n"}Assistant
            </>
          ) : (
            title
          )}
        </Text>
        <Text style={styles.whiteInfoDescription}>{description}</Text>
        <Pressable style={styles.nextButton}>
          <Text style={styles.nextButtonText}>{buttonLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [selectedAvatar, setSelectedAvatar] = useState("meera");

  const heroCardWidth = useMemo(() => Math.min(screenWidth * 0.74, 360), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        {starDots.map((dot) => (
          <View
            key={dot.id}
            style={[
              styles.starDot,
              { left: dot.left, top: dot.top, opacity: dot.opacity },
            ]}
          />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topMenuRow}
        >
          {topMenus.map((menu) => (
            <View key={menu} style={styles.topMenuChip}>
              <Text style={styles.topMenuChipText}>{menu}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.heroStage}>
          <Text style={[styles.backgroundWord, styles.backgroundWordLeft]}>AI</Text>
          <Text style={[styles.backgroundWord, styles.backgroundWordRight]}>nt</Text>

          {sideCallouts.map((callout) => (
            <View
              key={callout.id}
              style={[
                styles.calloutBlock,
                callout.side === "left" ? styles.calloutLeft : styles.calloutRight,
                { top: callout.top },
              ]}
            >
              <View style={styles.calloutLine} />
              <View style={styles.calloutIconCircle}>
                <MaterialIcons color={meeraTheme.white} name={callout.icon} size={18} />
              </View>
              <Text style={styles.calloutText}>{callout.title}</Text>
            </View>
          ))}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.phoneScroller}
            snapToAlignment="start"
            decelerationRate="fast"
          >
            {heroCards.map((card) => (
              <View key={card.id} style={{ width: heroCardWidth }}>
                <HeroPhoneCard
                  title={card.title}
                  description={card.description}
                  buttonLabel={card.buttonLabel}
                  accent={card.accent}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomCopyRow}>
          <Text style={styles.bottomCopyLeft}>
            DISCOVER THE NEXT GENERATION{"\n"}OF SMART AI ASSISTANT APP
          </Text>
          <Text style={styles.bottomCopyRight}>
            BUILD YOUR SMART{"\n"}AI ASSISTANT TODAY
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Your Avatar</Text>
          <Text style={styles.sectionMeta}>For the talk flow</Text>
        </View>

        {avatars.map((avatar) => {
          const selected = avatar.id === selectedAvatar;

          return (
            <Pressable
              key={avatar.id}
              style={[styles.avatarCard, selected && styles.avatarCardSelected]}
              onPress={() => setSelectedAvatar(avatar.id)}
            >
              <View style={styles.avatarPreviewWrap}>
                <Avatar
                  width={88}
                  height={96}
                  emotion={avatar.emotion}
                  isSpeaking={selected}
                />
              </View>

              <View style={styles.avatarInfo}>
                <View style={styles.avatarNameRow}>
                  <Text style={styles.avatarName}>{avatar.name}</Text>
                  <View style={styles.avatarBadge}>
                    <Text style={styles.avatarBadgeText}>{avatar.badge}</Text>
                  </View>
                </View>
                <Text style={styles.avatarRole}>{avatar.role}</Text>
                <Text style={styles.avatarDescription}>
                  Ready for onboarding, support conversations, and smart voice replies.
                </Text>
              </View>

              <View style={styles.avatarSelectCircle}>
                {selected && <View style={styles.avatarSelectInner} />}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121116",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#151419",
  },
  starDot: {
    position: "absolute",
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  content: {
    paddingTop: 14,
    paddingBottom: 120,
    gap: 18,
  },
  topMenuRow: {
    paddingHorizontal: 18,
    gap: 12,
    alignItems: "center",
  },
  topMenuChip: {
    minHeight: 40,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
    backgroundColor: "rgba(255,255,255,0.02)",
    alignItems: "center",
    justifyContent: "center",
  },
  topMenuChipText: {
    color: meeraTheme.white,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  heroStage: {
    minHeight: 860,
    justifyContent: "center",
    marginTop: 8,
  },
  backgroundWord: {
    position: "absolute",
    color: "rgba(255,255,255,0.18)",
    fontSize: 150,
    fontWeight: "900",
    letterSpacing: -8,
  },
  backgroundWordLeft: {
    left: -22,
    bottom: 100,
  },
  backgroundWordRight: {
    right: -18,
    bottom: 145,
  },
  calloutBlock: {
    position: "absolute",
    width: 140,
    alignItems: "center",
    gap: 10,
  },
  calloutLeft: {
    left: 10,
  },
  calloutRight: {
    right: 10,
  },
  calloutLine: {
    width: 1,
    height: 78,
    backgroundColor: "rgba(255,255,255,0.38)",
  },
  calloutIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.72)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(17,17,23,0.9)",
  },
  calloutText: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
    textAlign: "center",
    letterSpacing: 0.4,
  },
  phoneScroller: {
    paddingHorizontal: 68,
    gap: 22,
    alignItems: "center",
  },
  phoneFrame: {
    minHeight: 690,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "#140912",
    overflow: "hidden",
    ...meeraShadows.soft,
  },
  heroGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    top: 120,
    left: 70,
  },
  heroGlowSecondary: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    top: 150,
    right: 28,
  },
  heroGlowOrange: {
    backgroundColor: "rgba(255,172,88,0.48)",
  },
  heroGlowBlue: {
    backgroundColor: "rgba(90,120,255,0.42)",
  },
  heroGlowPink: {
    backgroundColor: "rgba(219,40,255,0.34)",
  },
  phoneTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  phoneTopText: {
    color: meeraTheme.white,
    fontSize: 13,
    fontWeight: "700",
  },
  dynamicIsland: {
    width: 110,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#040406",
  },
  phoneStatusWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  batteryWrap: {
    minWidth: 26,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: meeraTheme.white,
    alignItems: "center",
  },
  batteryText: {
    color: "#14111A",
    fontSize: 10,
    fontWeight: "800",
  },
  phoneVisualArea: {
    paddingTop: 38,
    alignItems: "center",
  },
  neonPanel: {
    width: 238,
    height: 238,
    borderRadius: 42,
    backgroundColor: "#2B262E",
    borderWidth: 5,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  neonPanelChat: {
    borderColor: "rgba(255,194,50,0.7)",
    shadowColor: "#EA00FF",
    shadowOpacity: 0.8,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 0 },
    elevation: 18,
  },
  neonPanelVoice: {
    borderColor: "rgba(255,176,60,0.72)",
    shadowColor: "#5B7CFF",
    shadowOpacity: 0.8,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 0 },
    elevation: 18,
  },
  chatCardShell: {
    width: "100%",
    borderRadius: 22,
    borderWidth: 3,
    borderColor: "rgba(255,66,66,0.45)",
    padding: 16,
    backgroundColor: "#252227",
    gap: 16,
  },
  chatCardLineShort: {
    width: 52,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  chatOrb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: meeraTheme.purple,
  },
  chatTextWrap: {
    flex: 1,
    gap: 8,
  },
  chatLineLong: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.26)",
  },
  chatLineMid: {
    width: "72%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  chatLineShort: {
    width: "56%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  chatAvatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  voicePanelInner: {
    alignItems: "center",
    gap: 10,
  },
  voiceLineWide: {
    width: 132,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.24)",
  },
  voiceLineMedium: {
    width: 110,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  neonPanelDots: {
    ...StyleSheet.absoluteFillObject,
  },
  colorDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotTopLeft: {
    top: 18,
    left: 18,
  },
  dotTopRight: {
    top: 22,
    right: 20,
  },
  dotBottomLeft: {
    left: 22,
    bottom: 22,
  },
  dotBottomRight: {
    right: 22,
    bottom: 18,
  },
  whiteInfoCard: {
    flex: 1,
    marginTop: 36,
    backgroundColor: "#FCFBFD",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: "center",
  },
  whiteInfoTitle: {
    color: "#17131D",
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "900",
    textAlign: "center",
  },
  whiteInfoAccent: {
    color: "#5A79FF",
  },
  whiteInfoDescription: {
    color: "#5C5866",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 18,
    maxWidth: 260,
  },
  nextButton: {
    width: "100%",
    minHeight: 56,
    borderRadius: 28,
    marginTop: 26,
    backgroundColor: meeraTheme.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: meeraTheme.white,
    fontSize: 18,
    fontWeight: "700",
  },
  bottomCopyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 18,
    paddingHorizontal: 18,
    marginTop: -12,
  },
  bottomCopyLeft: {
    flex: 1,
    color: meeraTheme.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  bottomCopyRight: {
    flex: 1,
    color: meeraTheme.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    textAlign: "right",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 18,
  },
  sectionTitle: {
    color: meeraTheme.white,
    fontSize: 22,
    fontWeight: "800",
  },
  sectionMeta: {
    color: meeraTheme.textMuted,
    fontSize: 13,
  },
  avatarCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 24,
    padding: 14,
    marginHorizontal: 18,
    backgroundColor: meeraTheme.surface,
    borderWidth: 1,
    borderColor: meeraTheme.borderSoft,
  },
  avatarCardSelected: {
    borderColor: "rgba(177,13,255,0.65)",
    backgroundColor: meeraTheme.surfaceAlt,
  },
  avatarPreviewWrap: {
    width: 96,
    height: 104,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  avatarInfo: {
    flex: 1,
    gap: 6,
  },
  avatarNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarName: {
    color: meeraTheme.white,
    fontSize: 18,
    fontWeight: "800",
  },
  avatarBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "rgba(177,13,255,0.14)",
  },
  avatarBadgeText: {
    color: "#E2B4FF",
    fontSize: 11,
    fontWeight: "700",
  },
  avatarRole: {
    color: meeraTheme.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  avatarDescription: {
    color: "#988DA9",
    fontSize: 13,
    lineHeight: 20,
  },
  avatarSelectCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSelectInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: meeraTheme.purple,
  },
});
