import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useStore, FERTILIZER_PLANS } from "@/store/useStore";
import { useTranslation } from "@/i18n";
import ScreenHeader from "@/components/ScreenHeader";

const NPK_COLORS = {
  N: "#2E7D32",
  P: "#1565C0",
  K: "#FF8F00",
};

const URGENCY_COLOR = {
  high: "#C62828",
  medium: "#FF8F00",
  low: "#2E7D32",
};

const URGENCY_BG = {
  high: "#FFEBEE",
  medium: "#FFF8E1",
  low: "#E8F5E9",
};

export default function FertigationScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, zones } = useStore();
  const t = useTranslation(language);
  const [selectedZone, setSelectedZone] = useState<string>("all");

  const filteredPlans = selectedZone === "all"
    ? FERTILIZER_PLANS
    : FERTILIZER_PLANS.filter((p) => p.zone === selectedZone);

  const selectedZoneData = selectedZone !== "all" ? zones.find((z) => z.id === selectedZone) : null;

  const getNpkStatusColor = (status: string) => {
    if (status === "low") return colors.danger;
    if (status === "high") return colors.warning;
    return colors.lightGreen;
  };

  const getNpkStatusLabel = (status: string) => {
    const key = status as keyof typeof t.fertigation.npkLevel;
    return t.fertigation.npkLevel[key];
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t.fertigation.title} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          <View style={styles.chipRow}>
            {[{ id: "all", labelMr: "सर्व", labelEn: "All" }, ...zones.map((z) => ({ id: z.id, labelMr: `${z.name} - ${z.cropMr}`, labelEn: `${z.name} - ${z.cropEn}` }))].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selectedZone === item.id ? colors.primary : colors.card,
                    borderColor: selectedZone === item.id ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedZone(item.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, { color: selectedZone === item.id ? "#fff" : colors.foreground }]}>
                  {language === "en" ? item.labelEn : item.labelMr}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {selectedZoneData && (
          <View style={[styles.npkCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t.fertigation.npk}</Text>
            <View style={styles.npkRow}>
              {(["N", "P", "K"] as const).map((key) => {
                const val = selectedZoneData.npk[key.toLowerCase() as "n" | "p" | "k"];
                const status = selectedZoneData.npkStatus[key.toLowerCase() as "n" | "p" | "k"];
                return (
                  <View key={key} style={[styles.npkTile, { backgroundColor: NPK_COLORS[key] + "15", borderColor: NPK_COLORS[key] + "40", borderWidth: 1 }]}>
                    <Text style={[styles.npkKey, { color: NPK_COLORS[key] }]}>{key}</Text>
                    <Text style={[styles.npkVal, { color: NPK_COLORS[key] }]}>{val}</Text>
                    <View style={[styles.npkStatus, { backgroundColor: getNpkStatusColor(status) }]}>
                      <Text style={styles.npkStatusText}>{getNpkStatusLabel(status)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={styles.phRow}>
              <View style={[styles.phTile, { backgroundColor: colors.paleSoil, borderRadius: 8 }]}>
                <Text style={[styles.phLabel, { color: colors.soilBrown }]}>pH</Text>
                <Text style={[styles.phVal, { color: colors.soilBrown }]}>{selectedZoneData.npk.ph}</Text>
              </View>
              <View style={[styles.phTile, { backgroundColor: colors.infoBg, borderRadius: 8 }]}>
                <Text style={[styles.phLabel, { color: colors.info }]}>EC</Text>
                <Text style={[styles.phVal, { color: colors.info }]}>1.4 mS/cm</Text>
              </View>
            </View>
          </View>
        )}

        {selectedZone === "all" && (
          <View style={styles.allZonesNpk}>
            {zones.map((zone) => (
              <View key={zone.id} style={[styles.zoneNpkRow, { backgroundColor: colors.card, borderRadius: colors.radius, borderLeftColor: zone.color, borderLeftWidth: 3 }]}>
                <Text style={[styles.zoneNpkTitle, { color: zone.color }]}>
                  {zone.name} — {language === "en" ? zone.cropEn : zone.cropMr}
                </Text>
                <View style={styles.npkSmall}>
                  {(["N", "P", "K"] as const).map((key) => {
                    const val = zone.npk[key.toLowerCase() as "n" | "p" | "k"];
                    const status = zone.npkStatus[key.toLowerCase() as "n" | "p" | "k"];
                    return (
                      <View key={key} style={[styles.npkSmallTile, { backgroundColor: NPK_COLORS[key] + "15" }]}>
                        <Text style={[styles.npkSmallKey, { color: NPK_COLORS[key] }]}>{key}: {val}</Text>
                        <View style={[styles.npkSmallStatus, { backgroundColor: getNpkStatusColor(status) }]}>
                          <Text style={styles.npkSmallStatusText}>{getNpkStatusLabel(status)}</Text>
                        </View>
                      </View>
                    );
                  })}
                  <View style={[styles.npkSmallTile, { backgroundColor: colors.paleSoil }]}>
                    <Text style={[styles.npkSmallKey, { color: colors.soilBrown }]}>pH {zone.npk.ph}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t.fertigation.aiPlan}</Text>
        {filteredPlans.map((plan, i) => (
          <View key={i} style={[styles.planRow, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: URGENCY_COLOR[plan.urgency] + "30", borderWidth: 1 }]}>
            <View style={[styles.planIcon, { backgroundColor: colors.paleSoil }]}>
              <Feather name="zap" size={18} color={colors.soilBrown} />
            </View>
            <View style={styles.planContent}>
              <View style={styles.planHeader}>
                <Text style={[styles.planName, { color: colors.foreground }]}>
                  {language === "en" ? plan.nameEn : plan.nameMr}
                </Text>
                <View style={[styles.urgencyPill, { backgroundColor: URGENCY_BG[plan.urgency] }]}>
                  <Text style={[styles.urgencyText, { color: URGENCY_COLOR[plan.urgency] }]}>
                    {t.fertigation.urgency[plan.urgency]}
                  </Text>
                </View>
              </View>
              <Text style={[styles.planQty, { color: colors.mutedForeground }]}>
                Zone {plan.zone} — {plan.quantity}
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.autoBtn, { backgroundColor: colors.soilBrown }]}
          activeOpacity={0.8}
        >
          <Feather name="zap" size={18} color="#fff" />
          <Text style={styles.autoBtnText}>{t.fertigation.startAuto}</Text>
        </TouchableOpacity>

        <View style={{ height: Platform.OS === "web" ? 92 : insets.bottom + 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  chipScroll: { marginBottom: 4 },
  chipRow: { flexDirection: "row", gap: 8, paddingBottom: 4 },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1.5,
  },
  chipText: { fontSize: 12, fontWeight: "600" },
  npkCard: {
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700" },
  npkRow: { flexDirection: "row", gap: 8 },
  npkTile: {
    flex: 1,
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  npkKey: { fontSize: 18, fontWeight: "800" },
  npkVal: { fontSize: 22, fontWeight: "700" },
  npkStatus: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  npkStatusText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  phRow: { flexDirection: "row", gap: 8 },
  phTile: { flex: 1, alignItems: "center", padding: 10, gap: 2 },
  phLabel: { fontSize: 11, fontWeight: "600" },
  phVal: { fontSize: 18, fontWeight: "700" },
  allZonesNpk: { gap: 8 },
  zoneNpkRow: {
    padding: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  zoneNpkTitle: { fontSize: 13, fontWeight: "700" },
  npkSmall: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  npkSmallTile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  npkSmallKey: { fontSize: 11, fontWeight: "600" },
  npkSmallStatus: { borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 },
  npkSmallStatusText: { color: "#fff", fontSize: 8, fontWeight: "700" },
  planRow: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  planIcon: { borderRadius: 20, padding: 8 },
  planContent: { flex: 1, gap: 3 },
  planHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  planName: { fontSize: 14, fontWeight: "600", flex: 1 },
  urgencyPill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  urgencyText: { fontSize: 10, fontWeight: "700" },
  planQty: { fontSize: 12 },
  autoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  autoBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
