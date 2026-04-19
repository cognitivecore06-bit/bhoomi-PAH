import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n";
import ScreenHeader from "@/components/ScreenHeader";
import AlertRow from "@/components/AlertRow";

type FilterType = "all" | "irrigation" | "fertilizer" | "fault" | "weather";

const FAULT_SENSORS = [
  { name: "Zone A Moisture Sensor", status: "ok" },
  { name: "Zone B Moisture Sensor", status: "ok" },
  { name: "Zone C Moisture Sensor", status: "ok" },
  { name: "Zone D Moisture Sensor", status: "ok" },
  { name: "Flow Meter", status: "ok" },
  { name: "Solar Panel Controller", status: "ok" },
];

export default function AlertsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, alerts, markAlertRead, markAllRead } = useStore();
  const t = useTranslation(language);
  const [filter, setFilter] = useState<FilterType>("all");

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: t.alerts.all },
    { key: "irrigation", label: t.alerts.irrigation },
    { key: "fertilizer", label: t.alerts.fertilizer },
    { key: "fault", label: t.alerts.fault },
    { key: "weather", label: t.alerts.weather },
  ];

  const filtered = filter === "all"
    ? alerts
    : alerts.filter((a) => a.category === filter);

  const unread = alerts.filter((a) => !a.read).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={t.alerts.title}
        subtitle={unread > 0 ? `${unread} ${t.alerts.unread}` : undefined}
        right={
          unread > 0 ? (
            <TouchableOpacity
              style={[styles.markAllBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
              onPress={markAllRead}
              activeOpacity={0.8}
            >
              <Text style={styles.markAllText}>{t.alerts.markAllRead}</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.chip,
                  {
                    backgroundColor: filter === f.key ? colors.primary : colors.card,
                    borderColor: filter === f.key ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, { color: filter === f.key ? "#fff" : colors.foreground }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="check-circle" size={36} color={colors.lightGreen} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {language === "en" ? "No alerts" : "कोणतीही सूचना नाही"}
            </Text>
          </View>
        ) : (
          filtered.map((alert) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              language={language}
              onPress={() => markAlertRead(alert.id)}
              markReadText={t.alerts.markRead}
            />
          ))
        )}

        <View style={[styles.faultCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <View style={styles.faultHeader}>
            <Feather name="shield" size={16} color={colors.primary} />
            <Text style={[styles.faultTitle, { color: colors.foreground }]}>{t.alerts.faultDetection}</Text>
            <View style={[styles.allOkBadge, { backgroundColor: colors.successBg }]}>
              <Feather name="check" size={10} color={colors.success} />
              <Text style={[styles.allOkText, { color: colors.success }]}>{t.alerts.noFaults}</Text>
            </View>
          </View>
          {FAULT_SENSORS.map((s) => (
            <View key={s.name} style={[styles.sensorRow, { borderBottomColor: colors.border }]}>
              <Feather name="check-circle" size={14} color={colors.success} />
              <Text style={[styles.sensorName, { color: colors.foreground }]}>{s.name}</Text>
              <Text style={[styles.sensorOk, { color: colors.success }]}>OK</Text>
            </View>
          ))}
        </View>

        <View style={{ height: Platform.OS === "web" ? 92 : insets.bottom + 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterBar: { paddingHorizontal: 16, paddingVertical: 10 },
  chipRow: { flexDirection: "row", gap: 8 },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
  },
  chipText: { fontSize: 12, fontWeight: "600" },
  content: { padding: 16, gap: 2 },
  markAllBtn: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  markAllText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 40,
  },
  emptyText: { fontSize: 14 },
  faultCard: {
    padding: 14,
    gap: 8,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  faultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  faultTitle: { fontSize: 14, fontWeight: "700", flex: 1 },
  allOkBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  allOkText: { fontSize: 10, fontWeight: "600" },
  sensorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  sensorName: { fontSize: 13, flex: 1 },
  sensorOk: { fontSize: 12, fontWeight: "600" },
});
