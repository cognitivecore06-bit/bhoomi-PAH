import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface AIBubbleProps {
  message: string;
  label: string;
}

export default function AIBubble({ message, label }: AIBubbleProps) {
  const colors = useColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.paleGreen, borderRadius: colors.radius, borderColor: colors.lightGreen + "50", borderWidth: 1 }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primary }]}>
        <Feather name="cpu" size={16} color="#fff" />
      </View>
      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.primary }]}>{label}</Text>
        <Text style={[styles.message, { color: colors.foreground }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    alignItems: "flex-start",
  },
  iconWrap: {
    borderRadius: 16,
    padding: 6,
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
  },
});
