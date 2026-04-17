import { meeraTheme } from "@/src/theme/meeraTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import TypewriterText from "@/src/components/ui/TypewriterText";
import AnimatedGlow from "@/src/components/ui/AnimatedGlow";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const recentConversations = [
  { id: "c1", title: "Build a startup plan", time: "2 hours ago", icon: "rocket-launch" },
  { id: "c2", title: "Fix my React bug", time: "Yesterday", icon: "bug-report" }
];

const popularTopics = [
  { id: "yoga", title: "Recommendations\nyoga poses", icon: "self-improvement" },
  { id: "travel", title: "A very useful travel kit\nfor traveling", icon: "card-travel" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Ready to help you with anything...");
  const [smartSuggestions, setSmartSuggestions] = useState<{id: string, label: string}[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setSmartSuggestions([
        { id: "1", label: "Morning productivity" },
        { id: "2", label: "Plan my day" },
        { id: "3", label: "Quick news" },
      ]);
    } else if (hour > 17) {
      setSmartSuggestions([
        { id: "1", label: "Evening relaxation" },
        { id: "2", label: "Lofi Beats" },
        { id: "3", label: "Daily wrap-up" },
      ]);
    } else {
      setSmartSuggestions([
        { id: "1", label: "Coding help" },
        { id: "2", label: "Technical issues" },
        { id: "3", label: "Business logic" },
      ]);
    }

    const phrases = [
      "Ready to help you with anything 😄",
      "Try asking about business, coding, or life"
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      setGreeting(phrases[i]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Gradient */}
      <View style={styles.backgroundContainer}>
        <AnimatedGlow size={800} style={styles.topGradientGlow} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerArea}>
          <Text style={styles.greetingTitle}>Hi Alex!</Text>
          <TypewriterText text={greeting} style={styles.greetingSubtitle} delay={40} />
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Conversations</Text>
        </View>
        
        <View style={styles.recentList}>
          {recentConversations.map((item) => (
            <Pressable key={item.id} style={styles.recentItem} onPress={() => router.push("/explore")}>
              <View style={styles.recentIconWrap}>
                <MaterialIcons name={item.icon as any} size={20} color={meeraTheme.white} />
              </View>
              <View style={styles.recentTextWrap}>
                <Text style={styles.recentItemTitle}>{item.title}</Text>
                <Text style={styles.recentItemTime}>{item.time}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={meeraTheme.textMuted} />
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Smart Suggestions</Text>
        </View>

        <View style={styles.chipsContainer}>
          {smartSuggestions.map((item) => (
            <Pressable key={item.id} style={styles.chip} onPress={() => router.push("/explore")}>
              <MaterialIcons name="auto-awesome" size={14} color={meeraTheme.purple} />
              <Text style={styles.chipText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular topics</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScroller}
        >
          {popularTopics.map((topic) => (
            <View key={topic.id} style={styles.topicCard}>
              <View style={styles.topicIconCircle}>
                <MaterialIcons name={topic.icon as any} size={22} color={meeraTheme.textMuted} />
              </View>
              <Text style={styles.topicTitle}>{topic.title}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Floating Input Bar */}
      <View style={styles.floatingInputWrapper}>
        <Pressable 
          style={styles.inputContainer}
          onPress={() => router.push("/explore")}
        >
          <Text style={styles.textInput}>Ask anything... Try: Build a startup plan</Text>
          <View style={styles.inputActions}>
            <MaterialIcons name="graphic-eq" size={20} color={meeraTheme.textMuted} />
            <Pressable 
              style={styles.sendButton}
              onPress={(e) => {
                e.stopPropagation();
                router.push("/voice");
              }}
            >
              <MaterialIcons name="keyboard-voice" size={20} color="#081016" />
            </Pressable>
          </View>
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
    overflow: "hidden",
  },
  topGradientGlow: {
    position: "absolute",
    top: -300,
    left: -200,
    opacity: 0.5,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 140, // Space for floating input
    gap: 32,
  },
  headerArea: {
    alignItems: "center",
  },
  greetingTitle: {
    color: meeraTheme.white,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  greetingSubtitle: {
    color: meeraTheme.textMuted,
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: meeraTheme.surfaceAlt,
    borderWidth: 1,
    borderColor: meeraTheme.borderSoft,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  chipText: {
    color: meeraTheme.white,
    fontSize: 13,
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: meeraTheme.white,
    fontSize: 16,
    fontWeight: "700",
  },
  seeAll: {
    color: meeraTheme.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  cardsScroller: {
    gap: 16,
  },
  topicCard: {
    width: 140,
    height: 140,
    backgroundColor: meeraTheme.surfaceAlt,
    borderRadius: 24,
    padding: 18,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: meeraTheme.borderSoft,
  },
  topicIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: meeraTheme.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  topicTitle: {
    color: meeraTheme.white,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  floatingInputWrapper: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: meeraTheme.surfaceAlt,
    borderRadius: 36,
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: meeraTheme.borderSoft,
  },
  textInput: {
    flex: 1,
    color: meeraTheme.textMuted,
    fontSize: 15,
  },
  inputActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: meeraTheme.purple, // which is now emerald green
    alignItems: "center",
    justifyContent: "center",
  },
  recentList: {
    gap: 12,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: meeraTheme.surfaceAlt,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: meeraTheme.borderSoft,
    gap: 16,
  },
  recentIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(42, 231, 161, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  recentTextWrap: {
    flex: 1,
  },
  recentItemTitle: {
    color: meeraTheme.white,
    fontSize: 15,
    fontWeight: "600",
  },
  recentItemTime: {
    color: meeraTheme.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
});
