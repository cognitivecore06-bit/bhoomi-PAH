import React from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n";
import ScreenHeader from "@/components/ScreenHeader";

const SENSOR_LABELS = [
  { icon: "thermometer" as const, key: "temp", value: "28°C", labelMr: "तापमान", labelEn: "Temp" },
  { icon: "wind" as const, key: "hum", value: "62%", labelMr: "हवेतील आर्द्रता", labelEn: "Humidity" },
  { icon: "sun" as const, key: "light", value: "8200 lux", labelMr: "प्रकाश", labelEn: "Light" },
];

export default function ZonesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, zones, toggleValve } = useStore();
  const t = useTranslation(language);

  const mapColors: Record<string, string> = {
    good: colors.lightGreen,
    warning: colors.warning,
    critical: colors.danger,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={t.zones.title}
        subtitle={`${zones.length} zones active`}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mapContainer, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.mapTitle, { color: colors.foreground }]}>
            <Feather name="map" size={14} color={colors.primary} /> {language === "en" ? "Farm Layout" : "शेत नकाशा"}
          </Text>
          <View style={styles.mapGrid}>
            {zones.map((zone) => (
              <TouchableOpacity
                key={zone.id}
                style={[styles.mapCell, { backgroundColor: zone.bgColor, borderColor: zone.color, borderWidth: 2 }]}
                onPress={() => toggleValve(zone.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.mapZone, { color: zone.color }]}>{zone.name}</Text>
                <Text style={[styles.mapCrop, { color: colors.foreground }]}>
                  {language === "en" ? zone.cropEn : zone.cropMr}
                </Text>
                <Text style={[styles.mapMoisture, { color: zone.color }]}>{zone.moisture}%</Text>
                <View style={[styles.mapValve, { backgroundColor: zone.valveStatus === "on" ? zone.color : colors.border }]}>
                  <Feather
                    name={zone.valveStatus === "on" ? "zap" : "zap-off"}
                    size={10}
                    color={zone.valveStatus === "on" ? "#fff" : colors.mutedForeground}
                  />
                  <Text style={[styles.mapValveText, { color: zone.valveStatus === "on" ? "#fff" : colors.mutedForeground }]}>
                    {zone.valveStatus === "on" ? t.zones.valveOn : t.zones.valveOff}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.legend}>
            {["good", "warning", "critical"].map((s) => (
              <View key={s} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: mapColors[s] }]} />
                <Text style={[styles.legendText, { color: colors.mutedForeground }]}>
                  {t.zones.status[s as keyof typeof t.zones.status]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.sensorCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            <Feather name="activity" size={14} color={colors.primary} /> {language === "en" ? "Ambient Sensors" : "वातावरण सेन्सर"}
          </Text>
          <View style={styles.sensorRow}>
            {SENSOR_LABELS.map((s) => (
              <View key={s.key} style={[styles.sensorItem, { backgroundColor: colors.background }]}>
                <Feather name={s.icon} size={18} color={colors.primary} />
                <Text style={[styles.sensorValue, { color: colors.foreground }]}>{s.value}</Text>
                <Text style={[styles.sensorLabel, { color: colors.mutedForeground }]}>
                  {language === "en" ? s.labelEn : s.labelMr}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {zones.map((zone) => (
          <View key={zone.id} style={[styles.zoneDetail, { backgroundColor: colors.card, borderRadius: colors.radius, borderLeftColor: zone.color, borderLeftWidth: 4 }]}>
            <View style={styles.zoneDetailHeader}>
              <View style={[styles.zoneTag, { backgroundColor: zone.color }]}>
                <Text style={styles.zoneTagText}>{zone.name} — {language === "en" ? zone.cropEn : zone.cropMr}</Text>
              </View>
              <View style={[styles.statusPill, {
                backgroundColor: zone.status === "good" ? colors.successBg : zone.status === "warning" ? colors.warningBg : colors.dangerBg
              }]}>
                <Text style={[styles.statusText, {
                  color: zone.status === "good" ? colors.success : zone.status === "warning" ? colors.warning : colors.danger
                }]}>
                  {t.zones.status[zone.status]}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{t.zones.moisture}</Text>
                <Text style={[styles.detailValue, { color: zone.color }]}>{zone.moisture}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{t.zones.waterGiven}</Text>
                <Text style={[styles.detailValue, { color: colors.foreground }]}>{zone.waterGiven}L</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{t.zones.waterNeeded}</Text>
                <Text style={[styles.detailValue, { color: colors.foreground }]}>{zone.waterNeeded}L</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.valveBtn, {
                backgroundColor: zone.valveStatus === "on" ? zone.color : colors.background,
                borderColor: zone.color,
              }]}
              onPress={() => toggleValve(zone.id)}
              activeOpacity={0.8}
            >
              <Feather
                name={zone.valveStatus === "on" ? "zap" : "zap-off"}
                size={14}
                color={zone.valveStatus === "on" ? "#fff" : zone.color}
              />
              <Text style={[styles.valveBtnText, { color: zone.valveStatus === "on" ? "#fff" : zone.color }]}>
                {zone.valveStatus === "on" ? "⚡ Valve: ON — Open" : "⚡ Valve: OFF — Close"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ height: Platform.OS === "web" ? 92 : insets.bottom + 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  mapContainer: {
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  mapTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  mapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  mapCell: {
    width: "48%" as any,
    borderRadius: 10,
    padding: 12,
    gap: 4,
    alignItems: "center",
  },
  mapZone: {
    fontSize: 11,
    fontWeight: "700",
  },
  mapCrop: {
    fontSize: 16,
    fontWeight: "700",
  },
  mapMoisture: {
    fontSize: 22,
    fontWeight: "800",
  },
  mapValve: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 2,
  },
  mapValveText: {
    fontSize: 10,
    fontWeight: "600",
  },
  legend: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginTop: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
  },
  sensorCard: {
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  sensorRow: {
    flexDirection: "row",
    gap: 8,
  },
  sensorItem: {
    flex: 1,
    alignItems: "center",
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  sensorValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  sensorLabel: {
    fontSize: 10,
    textAlign: "center",
  },
  zoneDetail: {
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  zoneDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  zoneTag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  zoneTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  statusPill: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    gap: 8,
  },
  detailItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  detailLabel: {
    fontSize: 10,
    textAlign: "center",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  valveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1.5,
  },
  valveBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
