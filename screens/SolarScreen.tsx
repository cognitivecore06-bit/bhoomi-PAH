import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useStore, SOLAR_DATA } from "@/store/useStore";
import { useTranslation } from "@/i18n";
import ScreenHeader from "@/components/ScreenHeader";
import StatCard from "@/components/StatCard";

export default function SolarScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const t = useTranslation(language);
  const solar = SOLAR_DATA;

  const maxKw = Math.max(...solar.chartData.map((d) => d.kw));
  const barHeight = 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t.solar.title} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.kpiGrid}>
          <StatCard
            icon="sun"
            label={t.solar.generating}
            value={`${solar.generating} kW`}
            color={colors.sunYellow}
          />
          <StatCard
            icon="battery-charging"
            label={t.solar.battery}
            value={`${solar.battery}%`}
            color={colors.lightGreen}
          />
          <StatCard
            icon="zap"
            label={t.solar.todayGenerated}
            value={`${solar.todayGenerated} kWh`}
            color={colors.warning}
          />
          <StatCard
            icon="activity"
            label={t.solar.usage}
            value={`${solar.usage} kW`}
            color={colors.skyBlue}
          />
        </View>

        <View style={[styles.batteryCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <View style={styles.batteryHeader}>
            <Feather name="battery-charging" size={18} color={colors.lightGreen} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t.solar.battery}</Text>
            <Text style={[styles.batteryPct, { color: colors.lightGreen }]}>{solar.battery}%</Text>
          </View>
          <View style={[styles.batteryTrack, { backgroundColor: colors.border + "60" }]}>
            <View
              style={[
                styles.batteryFill,
                {
                  width: `${solar.battery}%` as any,
                  backgroundColor: solar.battery > 50 ? colors.lightGreen : solar.battery > 20 ? colors.warning : colors.danger,
                },
              ]}
            />
            <View style={styles.batterySegments}>
              {[25, 50, 75].map((pct) => (
                <View key={pct} style={[styles.segment, { left: `${pct}%` as any, backgroundColor: colors.card }]} />
              ))}
            </View>
          </View>
          <View style={styles.batteryFooter}>
            <Text style={[styles.estText, { color: colors.mutedForeground }]}>
              {t.solar.estFullCharge}: {solar.estFullCharge}
            </Text>
            <View style={[styles.panelStatus, { backgroundColor: colors.successBg }]}>
              <Feather name="check-circle" size={11} color={colors.success} />
              <Text style={[styles.panelStatusText, { color: colors.success }]}>{t.solar.panelActive}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.energyMsg, { backgroundColor: colors.paleGreen, borderRadius: colors.radius, borderColor: colors.lightGreen + "50", borderWidth: 1 }]}>
          <Feather name="zap" size={16} color={colors.primary} />
          <Text style={[styles.energyMsgText, { color: colors.primary }]}>{t.solar.energyMessage}</Text>
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t.solar.hourly}</Text>
          <View style={styles.chart}>
            {solar.chartData.map((d) => {
              const pct = maxKw > 0 ? (d.kw / maxKw) : 0;
              return (
                <View key={d.hour} style={styles.barGroup}>
                  <Text style={[styles.barValue, { color: colors.sunYellow }]}>{d.kw}</Text>
                  <View style={[styles.barTrack, { height: barHeight, backgroundColor: colors.background }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: pct * barHeight,
                          backgroundColor: colors.sunYellow,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, { color: colors.mutedForeground }]}>{d.hour}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.chartLegend}>
            <View style={[styles.legendDot, { backgroundColor: colors.sunYellow }]} />
            <Text style={[styles.legendText, { color: colors.mutedForeground }]}>kW Generated</Text>
          </View>
        </View>

        <View style={[styles.panelCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t.solar.panelStatus}</Text>
          <View style={styles.panelRow}>
            <View style={styles.panelItem}>
              <Feather name="sun" size={20} color={colors.sunYellow} />
              <Text style={[styles.panelLabel, { color: colors.mutedForeground }]}>
                {language === "en" ? "Capacity" : "क्षमता"}
              </Text>
              <Text style={[styles.panelValue, { color: colors.foreground }]}>{solar.panelCapacity} kW</Text>
            </View>
            <View style={[styles.panelDivider, { backgroundColor: colors.border }]} />
            <View style={styles.panelItem}>
              <Feather name="activity" size={20} color={colors.lightGreen} />
              <Text style={[styles.panelLabel, { color: colors.mutedForeground }]}>
                {language === "en" ? "Current" : "सध्या"}
              </Text>
              <Text style={[styles.panelValue, { color: colors.lightGreen }]}>{solar.generating} kW</Text>
            </View>
            <View style={[styles.panelDivider, { backgroundColor: colors.border }]} />
            <View style={styles.panelItem}>
              <Feather name="percent" size={20} color={colors.skyBlue} />
              <Text style={[styles.panelLabel, { color: colors.mutedForeground }]}>
                {language === "en" ? "Efficiency" : "कार्यक्षमता"}
              </Text>
              <Text style={[styles.panelValue, { color: colors.skyBlue }]}>
                {Math.round((solar.generating / solar.panelCapacity) * 100)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: Platform.OS === "web" ? 92 : insets.bottom + 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  kpiGrid: { flexDirection: "row", gap: 8 },
  batteryCard: {
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  batteryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", flex: 1 },
  batteryPct: { fontSize: 20, fontWeight: "800" },
  batteryTrack: {
    height: 20,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  batteryFill: {
    height: "100%",
    borderRadius: 10,
  },
  batterySegments: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },
  segment: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
  },
  batteryFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  estText: { fontSize: 12 },
  panelStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  panelStatusText: { fontSize: 11, fontWeight: "600" },
  energyMsg: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
  },
  energyMsgText: { fontSize: 13, fontWeight: "500", flex: 1 },
  chartCard: {
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    paddingVertical: 4,
  },
  barGroup: { flex: 1, alignItems: "center", gap: 4 },
  barValue: { fontSize: 9, fontWeight: "700" },
  barTrack: {
    width: "100%",
    borderRadius: 4,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: { borderRadius: 4 },
  barLabel: { fontSize: 8, textAlign: "center" },
  chartLegend: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11 },
  panelCard: {
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  panelRow: { flexDirection: "row", alignItems: "center" },
  panelItem: { flex: 1, alignItems: "center", gap: 4 },
  panelDivider: { width: 1, height: 50 },
  panelLabel: { fontSize: 10, textAlign: "center" },
  panelValue: { fontSize: 16, fontWeight: "700" },
});
