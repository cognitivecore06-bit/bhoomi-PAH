import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Zone } from "@/store/useStore";
import MoistureBar from "./MoistureBar";

interface ValveToggleProps {
  zone: Zone;
  cropLabel: string;
  givenText: string;
  neededText: string;
  onToggle: () => void;
}

export default function ValveToggle({ zone, cropLabel, givenText, neededText, onToggle }: ValveToggleProps) {
  const colors = useColors();
  const isOn = zone.valveStatus === "on";
  const pct = zone.waterNeeded > 0 ? Math.round((zone.waterGiven / zone.waterNeeded) * 100) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: zone.color + "30", borderWidth: 1 }]}>
      <View style={styles.header}>
        <View style={[styles.zoneTag, { backgroundColor: zone.color }]}>
          <Text style={styles.zoneTagText}>{zone.name}</Text>
        </View>
        <Text style={[styles.cropName, { color: colors.foreground }]}>{cropLabel}</Text>
        <TouchableOpacity
          style={[styles.toggle, { backgroundColor: isOn ? zone.color : colors.border }]}
          onPress={onToggle}
          activeOpacity={0.8}
        >
          <View style={[styles.thumb, { left: isOn ? 20 : 2 }]} />
        </TouchableOpacity>
      </View>

      <View style={styles.bars}>
        <MoistureBar value={zone.moisture} color={zone.color} showLabel />
        <View style={styles.waterInfo}>
          <View style={[styles.progressTrack, { backgroundColor: colors.border + "60" }]}>
            <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: zone.color + "80" }]} />
          </View>
          <Text style={[styles.waterText, { color: colors.mutedForeground }]}>
            {givenText}: {zone.waterGiven}L / {neededText}: {zone.waterNeeded}L
          </Text>
        </View>
      </View>

      {zone.status === "critical" && (
        <View style={[styles.criticalBadge, { backgroundColor: colors.dangerBg }]}>
          <Feather name="alert-triangle" size={11} color={colors.danger} />
          <Text style={[styles.criticalText, { color: colors.danger }]}>Critical - Needs Water</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  zoneTag: {
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  zoneTagText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  cropName: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    position: "relative",
  },
  thumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    top: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  bars: {
    gap: 6,
  },
  waterInfo: {
    gap: 4,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  waterText: {
    fontSize: 11,
  },
  criticalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  criticalText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
