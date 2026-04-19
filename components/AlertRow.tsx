import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Alert } from "@/store/useStore";
import { Language } from "@/store/useStore";

interface AlertRowProps {
  alert: Alert;
  language: Language;
  onPress: () => void;
  markReadText: string;
}

const ALERT_CONFIG = {
  critical: { icon: "alert-triangle" as const, color: "#C62828", bg: "#FFEBEE" },
  warning: { icon: "alert-circle" as const, color: "#FF8F00", bg: "#FFF8E1" },
  info: { icon: "info" as const, color: "#1565C0", bg: "#E3F2FD" },
  success: { icon: "check-circle" as const, color: "#2E7D32", bg: "#E8F5E9" },
};

export default function AlertRow({ alert, language, onPress, markReadText }: AlertRowProps) {
  const colors = useColors();
  const cfg = ALERT_CONFIG[alert.type];
  const title = language === "en" ? alert.titleEn : alert.titleMr;
  const desc = language === "en" ? alert.descEn : alert.descMr;

  return (
    <TouchableOpacity
      style={[
        styles.row,
        {
          backgroundColor: alert.read ? colors.card : cfg.bg,
          borderLeftColor: cfg.color,
          borderRadius: colors.radius - 2,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconWrap, { backgroundColor: cfg.color + "20" }]}>
        <Feather name={cfg.icon} size={18} color={cfg.color} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {title}
          </Text>
          {!alert.read && (
            <View style={[styles.dot, { backgroundColor: cfg.color }]} />
          )}
        </View>
        <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
          {desc}
        </Text>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>{alert.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    borderLeftWidth: 3,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  iconWrap: {
    borderRadius: 20,
    padding: 8,
    alignSelf: "flex-start",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  desc: {
    fontSize: 12,
  },
  time: {
    fontSize: 11,
    marginTop: 2,
  },
});
