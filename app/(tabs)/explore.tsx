import { meeraTheme } from "@/src/theme/meeraTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import TypewriterText from "@/src/components/ui/TypewriterText";

const chatHistory = [
  {
    id: "m1",
    sender: "ai",
    content: "What are we building today? 😄",
    time: "10:00 AM",
    actions: ["Copy", "Share"],
  },
  {
    id: "m2",
    sender: "user",
    content: "Recommended music",
    time: "10:02 AM",
    actions: ["Edit"],
  },
  {
    id: "m3",
    sender: "ai",
    content: "Here are some quick reply suggestions for your vibe:",
    time: "10:02 AM",
    isDropdown: true,
    suggestions: [
      { id: "s1", icon: "music-note", label: "Lofi Beats" },
      { id: "s2", icon: "headset", label: "Nature & Ambient Sounds" },
      { id: "s3", icon: "local-fire-department", label: "Motivational & Classical" },
    ],
    actions: ["Copy", "Regenerate", "Like", "Dislike"],
    stream: true,
  },
];

const getActionIcon = (act: string) => {
  switch (act) {
    case "Copy": return "content-copy";
    case "Regenerate": return "refresh";
    case "Edit": return "edit";
    case "Like": return "thumb-up-off-alt";
    case "Dislike": return "thumb-down-off-alt";
    default: return "reply";
  }
};

export default function ChatScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={28} color={meeraTheme.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Chatpodia</Text>
        <Pressable style={styles.iconButton}>
          <MaterialIcons name="more-horiz" size={24} color={meeraTheme.white} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.chatScroll}
          showsVerticalScrollIndicator={false}
        >
          {chatHistory.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isUser ? styles.messageRowUser : styles.messageRowBot,
                ]}
              >
                {!isUser && (
                   <LinearGradient
                    colors={["#50FFE2", "#2AE7A1"]}
                    style={styles.botAvatar}
                  />
                )}

                <View style={[styles.bubbleWrap, isUser ? styles.bubbleWrapUser : styles.bubbleWrapBot]}>
                  <View
                    style={[
                      styles.messageBubble,
                      isUser ? styles.bubbleUser : styles.bubbleBot,
                    ]}
                  >
                    {!isUser && msg.isDropdown && (
                      <View style={styles.dropdownHeader}>
                        <MaterialIcons name="chat-bubble-outline" size={16} color={meeraTheme.white} />
                        <Text style={styles.dropdownTitle}>{msg.content}</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={20} color={meeraTheme.white} />
                      </View>
                    )}

                    {(!msg.isDropdown) && (
                      msg.stream ? (
                        <TypewriterText text={msg.content} style={[styles.messageText, isUser ? styles.textUser : styles.textBot]} delay={20} />
                      ) : (
                        <Text style={[styles.messageText, isUser ? styles.textUser : styles.textBot]}>
                          {msg.content}
                        </Text>
                      )
                    )}

                    {msg.isDropdown && msg.suggestions && (
                      <View style={styles.dropdownBody}>
                        {msg.suggestions.map((sug) => (
                          <View key={sug.id} style={styles.suggestionRow}>
                            <MaterialIcons name={sug.icon as any} size={18} color={meeraTheme.textMuted} />
                            <Text style={styles.suggestionText}>{sug.label}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>

                  <View style={styles.footerRow}>
                    <Text style={styles.timestamp}>{msg.time}</Text>

                    {msg.actions && (
                      <View style={styles.actionRow}>
                        {msg.actions.map((act) => (
                          <Pressable key={act} style={styles.actionPill}>
                            <MaterialIcons
                              name={getActionIcon(act) as any}
                              size={act === "Like" || act === "Dislike" ? 14 : 12}
                              color={meeraTheme.textMuted}
                            />
                            {act !== "Like" && act !== "Dislike" && (
                              <Text style={styles.actionText}>{act}</Text>
                            )}
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                {isUser && (
                  <View style={styles.botAvatar}>
                    <MaterialIcons name="person" size={24} color={meeraTheme.textMuted} />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.floatingInputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={meeraTheme.textMuted}
              autoFocus={true} // Auto focus when they land on chat
            />
            <View style={styles.inputActions}>
              <MaterialIcons name="graphic-eq" size={20} color={meeraTheme.textMuted} />
              <Pressable
                style={styles.sendButton}
                onPress={() => router.push("/voice")}
              >
                <MaterialIcons name="keyboard-voice" size={20} color="#081016" />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: meeraTheme.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  iconButton: {
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
  chatScroll: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20, // Reduced since input is no longer floating above it
    gap: 24,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageRowBot: {
    justifyContent: "flex-start",
  },
  botAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginBottom: 2,
    backgroundColor: meeraTheme.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: meeraTheme.borderSoft,
  },
  bubbleWrap: {
    maxWidth: "75%",
    gap: 8,
  },
  bubbleWrapUser: {
    alignItems: "flex-end",
  },
  bubbleWrapBot: {
    alignItems: "flex-start",
  },
  messageBubble: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
  },
  bubbleBot: {
    backgroundColor: meeraTheme.surfaceAlt,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: meeraTheme.borderSoft,
  },
  bubbleUser: {
    backgroundColor: meeraTheme.white,
    borderTopRightRadius: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  textBot: {
    color: meeraTheme.white,
  },
  textUser: {
    color: meeraTheme.textDark,
    fontWeight: "500",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 4,
  },
  timestamp: {
    color: meeraTheme.textMuted,
    fontSize: 11,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: meeraTheme.surfaceAlt,
    borderWidth: 1,
    borderColor: meeraTheme.borderSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  actionText: {
    color: meeraTheme.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: meeraTheme.borderSoft,
  },
  dropdownTitle: {
    color: meeraTheme.white,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  dropdownBody: {
    paddingTop: 12,
    gap: 16,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  suggestionText: {
    color: meeraTheme.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  floatingInputWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
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
    color: meeraTheme.white,
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
});
