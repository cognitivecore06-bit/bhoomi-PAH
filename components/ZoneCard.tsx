import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Zone } from "@/store/useStore";
import MoistureBar from "./MoistureBar";

interface ZoneCardProps {
  zone: Zone;
  label: string;
  valveOnText: string;
  valveOffText: string;
  openText: string;
  closeText: string;
  moistureText: string;
  onToggle: () => void;
  compact?: boolean;
}

export default function ZoneCard({
  zone, label, valveOnText, valveOffText, openText, closeText, moistureText, onToggle, compact
}: ZoneCardProps) {
  const colors = useColors();

  return (
    <View style={[styles.card, { backgroundColor: zone.bgColor, borderRadius: colors.radius, borderColor: zone.color + "40", borderWidth: 1 }]}>
      <View style={styles.header}>
        <View style={[styles.zoneTag, { backgroundColor: zone.color }]}>
          <Text style={styles.zoneTagText}>{zone.name}</Text>
        </View>
        <Text style={[styles.cropName, { color: zone.color }]}>{label}</Text>
        {zone.status === "critical" && (
          <View style={[styles.statusBadge, { backgroundColor: colors.danger }]}>
            <Feather name="alert-triangle" size={10} color="#fff" />
          </View>
        )}
        {zone.status === "warning" && (
          <View style={[styles.statusBadge, { backgroundColor: colors.warning }]}>
            <Feather name="alert-circle" size={10} color="#fff" />
          </View>
        )}
      </View>

      <MoistureBar value={zone.moisture} color={zone.color} />

      <View style={styles.row}>
        <Feather name="droplet" size={12} color={zone.color} />
        <Text style={[styles.info, { color: colors.foreground }]}>{moistureText}: {zone.moisture}%</Text>
      </View>

      {!compact && (
        <View style={styles.waterRow}>
          <Text style={[styles.waterText, { color: colors.mutedForeground }]}>{zone.waterGiven}L / {zone.waterNeeded}L</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.valveBtn, { backgroundColor: zone.valveStatus === "on" ? zone.color : colors.card, borderColor: zone.color }]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Feather
          name={zone.valveStatus === "on" ? "zap" : "zap-off"}
          size={13}
          color={zone.valveStatus === "on" ? "#fff" : zone.color}
        />
        <Text style={[styles.valveBtnText, { color: zone.valveStatus === "on" ? "#fff" : zone.color }]}>
          {zone.valveStatus === "on" ? (closeText + " " + valveOnText) : (openText + " " + valveOffText)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  zoneTag: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  zoneTagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  cropName: {
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  statusBadge: {
    borderRadius: 10,
    padding: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  info: {
    fontSize: 12,
    fontWeight: "500",
  },
  waterRow: {
    flexDirection: "row",
  },
  waterText: {
    fontSize: 11,
  },
  valveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 8,
    paddingVertical: 6,
    borderWidth: 1.5,
  },
  valveBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
