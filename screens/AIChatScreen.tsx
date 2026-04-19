import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MessageRole = "ai" | "user";

interface Message {
  id: string;
  role: MessageRole;
  text: string;
  time: string;
}

const AI_REPLIES = [
  "हे खूप चांगला प्रश्न आहे! \nतुमच्या शेताच्या सद्य परिस्थितीनुसार \nमी शिफारस करतो की आधी Zone D ला \nप्राधान्य द्या कारण moisture critical आहे. 💧",
  "हवामान अंदाजानुसार गुरुवारी \nपाऊस येणार आहे. त्यामुळे बुधवारी \nसर्व zones ची irrigation पूर्ण करा. \nZone A आणि B ला 50% कमी पाणी द्या. 🌧️",
  "NPK विश्लेषणानुसार Zone A मध्ये \nNitrogen (N) कमी आहे. \nप्रति एकर 25 किलो Urea टाका. \nZone D मध्ये सर्व nutrients कमी आहेत — \nसंपूर्ण fertigation plan लागेल. 🌱",
  "Solar panel सध्या 2.1 kW \ngenerate करत आहे. Battery 78% आहे. \nदुपारी 2:30 पर्यंत पूर्ण charge होईल. \nआत्ता irrigation चालू करणे योग्य आहे \nकारण solar power उपलब्ध आहे. ☀️",
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    text: "नमस्कार रमेश जी! मी भूमी AI आहे. \nतुमच्या शेताविषयी कोणताही प्रश्न विचारा. \nमी मराठी, हिंदी आणि English मध्ये \nउत्तर देऊ शकतो. 🌾",
    time: "9:00 AM",
  },
  {
    id: "2",
    role: "user",
    text: "Zone D मध्ये पाणी किती द्यावे?",
    time: "9:01 AM",
  },
  {
    id: "3",
    role: "ai",
    text: "Zone D मध्ये टोमॅटो पीक आहे. \nसध्या moisture 19% आहे जे critical आहे. \nआत्ता 390 लिटर पाणी द्या. \nगुरुवारी पाऊस अपेक्षित असल्याने \nशुक्रवारी पुन्हा तपासा. 🍅💧",
    time: "9:01 AM",
  },
];

const CHIPS = [
  "💧 पाणी किती द्यावे?",
  "🌱 खत कधी घालावे?",
  "☀️ Solar स्थिती",
  "🌧️ पावसाचा अंदाज",
];

function getCurrentTime(): string {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function TypingIndicator() {
  return (
    <View style={styles.typingRow}>
      <View style={styles.aiAvatar}>
        <MaterialCommunityIcons name="robot" size={18} color="#1B5E20" />
      </View>
      <View style={styles.aiBubble}>
        <Text style={styles.typingDotsText}>● ● ●</Text>
      </View>
    </View>
  );
}

export default function AIChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [micListening, setMicListening] = useState(false);
  const replyIndexRef = useRef(0);
  const scrollRef = useRef<ScrollView>(null);

  const hasUserMessage = messages.some((m) => m.role === "user" && m.id !== "2");

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    scrollToBottom();

    setTimeout(() => {
      const reply = AI_REPLIES[replyIndexRef.current % AI_REPLIES.length];
      replyIndexRef.current += 1;
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: reply,
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      scrollToBottom();
    }, 1500);
  };

  const handleMic = () => {
    setMicListening(true);
    setTimeout(() => {
      setMicListening(false);
      setInputText("उद्या सकाळी Zone B ला पाणी द्यावे का?");
    }, 2000);
  };

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const TAB_BAR_HEIGHT = Platform.OS === "web" ? 84 : 49;
  const bottomPad = TAB_BAR_HEIGHT + insets.bottom + 8;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { paddingTop: topPad }]}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.navigate("/")} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>AI सहाय्यक</Text>
            <Text style={styles.headerSubtitle}>भूमी स्मार्ट असिस्टंट</Text>
          </View>
          <MaterialCommunityIcons name="robot" size={28} color="#4CAF50" />
        </View>

        {/* SUBHEADER STRIP */}
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>🌱 शेतीविषयी कोणताही प्रश्न विचारा</Text>
        </View>

        {/* CHAT AREA */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.role === "user" ? styles.messageRowUser : styles.messageRowAI,
              ]}
            >
              {msg.role === "ai" && (
                <View style={styles.aiAvatar}>
                  <MaterialCommunityIcons name="robot" size={18} color="#1B5E20" />
                </View>
              )}
              <View style={[styles.bubbleWrapper, msg.role === "user" && styles.bubbleWrapperUser]}>
                <View style={msg.role === "ai" ? styles.aiBubble : styles.userBubble}>
                  <Text style={msg.role === "ai" ? styles.aiText : styles.userText}>
                    {msg.text}
                  </Text>
                </View>
                <Text style={[styles.timestamp, msg.role === "user" && styles.timestampUser]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* INPUT AREA */}
        <View style={[styles.inputContainer, { paddingBottom: bottomPad }]}>

          {/* SUGGESTION CHIPS */}
          {!hasUserMessage && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsScroll}
              contentContainerStyle={styles.chipsContent}
              keyboardShouldPersistTaps="handled"
            >
              {CHIPS.map((chip) => (
                <TouchableOpacity
                  key={chip}
                  style={styles.chip}
                  onPress={() => setInputText(chip)}
                >
                  <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* MIC LISTENING INDICATOR */}
          {micListening && (
            <View style={styles.micListening}>
              <Text style={styles.micListeningText}>🎤 ऐकत आहे...</Text>
            </View>
          )}

          {/* INPUT ROW */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="प्रश्न टाइप करा..."
              placeholderTextColor="#9E9E9E"
              multiline
            />
            <TouchableOpacity style={styles.micBtn} onPress={handleMic}>
              <Ionicons name="mic" size={22} color="#1B5E20" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F0",
  },
  header: {
    backgroundColor: "#1B5E20",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#A5D6A7",
    fontSize: 12,
  },
  subHeader: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 6,
    alignItems: "center",
  },
  subHeaderText: {
    color: "#2E7D32",
    fontSize: 12,
    textAlign: "center",
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  messageRowAI: {
    justifyContent: "flex-start",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    justifyContent: "flex-start",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleWrapper: {
    maxWidth: "75%",
    alignItems: "flex-start",
  },
  bubbleWrapperUser: {
    alignItems: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#1B5E20",
    borderRadius: 16,
    borderTopRightRadius: 4,
    padding: 12,
  },
  aiText: {
    color: "#1C1C1C",
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    color: "#9E9E9E",
    fontSize: 10,
    marginTop: 4,
  },
  timestampUser: {
    alignSelf: "flex-end",
  },
  typingDotsText: {
    color: "#9E9E9E",
    fontSize: 12,
    letterSpacing: 2,
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#BDBDBD",
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  chipsScroll: {
    marginBottom: 8,
  },
  chipsContent: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#1B5E20",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipText: {
    color: "#1B5E20",
    fontSize: 12,
  },
  micListening: {
    marginBottom: 8,
    alignItems: "center",
  },
  micListeningText: {
    color: "#1B5E20",
    fontSize: 13,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 4,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F5F5F0",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1C1C1C",
    maxHeight: 100,
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1B5E20",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "#BDBDBD",
  },
});
