import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  color?: string;
  bgColor?: string;
  small?: boolean;
}

export default function StatCard({ icon, label, value, color, bgColor, small }: StatCardProps) {
  const colors = useColors();
  const iconColor = color || colors.primary;
  const bg = bgColor || colors.card;

  return (
    <View style={[styles.card, { backgroundColor: bg, borderRadius: colors.radius - 2 }]}>
      <View style={[styles.iconWrap, { backgroundColor: iconColor + "20" }]}>
        <Feather name={icon} size={small ? 16 : 20} color={iconColor} />
      </View>
      <Text style={[styles.value, { color: colors.foreground, fontSize: small ? 15 : 18 }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={[styles.label, { color: colors.mutedForeground, fontSize: small ? 10 : 11 }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconWrap: {
    borderRadius: 20,
    padding: 8,
    marginBottom: 2,
  },
  value: {
    fontWeight: "700",
    textAlign: "center",
  },
  label: {
    textAlign: "center",
    fontWeight: "500",
  },
});
