import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";

interface MoistureBarProps {
  value: number;
  color: string;
  showLabel?: boolean;
}

export default function MoistureBar({ value, color, showLabel }: MoistureBarProps) {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: colors.border + "60" }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${value}%` as any,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={[styles.label, { color }]}>{value}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    width: 32,
    textAlign: "right",
  },
});
