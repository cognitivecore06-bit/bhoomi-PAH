import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useStore, WATER_ANALYTICS } from "@/store/useStore";
import { useTranslation } from "@/i18n";
import ScreenHeader from "@/components/ScreenHeader";
import StatCard from "@/components/StatCard";
import AIBubble from "@/components/AIBubble";

export default function AnalyticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, zones } = useStore();
  const t = useTranslation(language);
  const data = WATER_ANALYTICS;

  const maxL = Math.max(...data.weekData.map((d) => d.liters));
  const barHeight = 80;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t.analytics.title} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.kpiGrid}>
          <StatCard
            icon="droplet"
            label={t.analytics.todayUsage}
            value={`${data.todayL}L`}
            color={colors.skyBlue}
          />
          <StatCard
            icon="trending-down"
            label={t.analytics.savedPercent}
            value={`${data.savedPercent}%`}
            color={colors.lightGreen}
          />
          <StatCard
            icon="bar-chart-2"
            label={t.analytics.weekTotal}
            value={`${data.weekTotal}L`}
            color={colors.primary}
          />
          <StatCard
            icon="save"
            label={t.analytics.savedToday}
            value={`${data.savedToday}L`}
            color={colors.wheatGold}
          />
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t.analytics.weeklyChart}</Text>
          <View style={styles.chart}>
            {data.weekData.map((d) => {
              const pct = maxL > 0 ? d.liters / maxL : 0;
              const isToday = d.day === "आज" || d.dayEn === "Today";
              const isRain = d.liters === 0;
              return (
                <View key={d.dayEn} style={styles.barGroup}>
                  <Text style={[styles.barValue, { color: isToday ? colors.primary : colors.mutedForeground }]}>
                    {isRain ? "-" : Math.round(d.liters / 100) + "k"}
                  </Text>
                  <View style={[styles.barTrack, { height: barHeight, backgroundColor: colors.background }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: pct * barHeight,
                          backgroundColor: isRain
                            ? colors.infoBg
                            : isToday
                            ? colors.primary
                            : colors.lightGreen + "90",
                        },
                      ]}
                    />
                    {isRain && (
                      <View style={styles.rainIcon}>
                        <Feather name="cloud-rain" size={12} color={colors.skyBlue} />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.barLabel, { color: isToday ? colors.primary : colors.mutedForeground, fontWeight: isToday ? "700" : "400" }]}>
                    {language === "en" ? d.dayEn.slice(0, 3) : d.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={[styles.zoneCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t.analytics.zoneWise}</Text>
          {zones.map((zone) => {
            const pct = zone.waterNeeded > 0 ? (zone.waterGiven / zone.waterNeeded) * 100 : 0;
            return (
              <View key={zone.id} style={styles.zoneRow}>
                <View style={styles.zoneRowLeft}>
                  <View style={[styles.zoneTag, { backgroundColor: zone.color }]}>
                    <Text style={styles.zoneTagText}>{zone.name}</Text>
                  </View>
                  <Text style={[styles.zoneCrop, { color: colors.foreground }]}>
                    {language === "en" ? zone.cropEn : zone.cropMr}
                  </Text>
                </View>
                <View style={styles.zoneRowRight}>
                  <View style={[styles.progressTrack, { backgroundColor: colors.border + "60" }]}>
                    <View
                      style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: zone.color }]}
                    />
                  </View>
                  <Text style={[styles.zoneWater, { color: colors.mutedForeground }]}>
                    {zone.waterGiven}L / {zone.waterNeeded}L
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={[styles.predCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <View style={styles.predHeader}>
            <Feather name="cpu" size={14} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t.analytics.aiPrediction}</Text>
          </View>
          <View style={styles.predChart}>
            {data.aiPrediction.map((val, i) => {
              const isRain = val === 0;
              const maxPred = Math.max(...data.aiPrediction.filter((v) => v > 0));
              const pct = isRain ? 0 : val / maxPred;
              const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
              return (
                <View key={i} style={styles.predBarGroup}>
                  <View style={[styles.predTrack, { backgroundColor: colors.background }]}>
                    <View
                      style={[styles.predFill, {
                        height: `${pct * 100}%` as any,
                        backgroundColor: isRain ? colors.infoBg : colors.skyBlue + "80"
                      }]}
                    />
                    {isRain && (
                      <View style={styles.rainOverlay}>
                        <Feather name="cloud-rain" size={10} color={colors.skyBlue} />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.predLabel, { color: colors.mutedForeground }]}>{days[i]}</Text>
                  <Text style={[styles.predVal, { color: isRain ? colors.skyBlue : colors.foreground }]}>
                    {isRain ? "Rain" : `${Math.round(val / 100) * 0.1}k`}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <AIBubble
          message={language === "en"
            ? "This week you saved 24% water compared to last week. Rain expected Thursday — irrigation auto-skipped. Recommend starting Zone D irrigation now."
            : "या आठवड्यात गेल्या आठवड्यापेक्षा २४% पाणी बचत झाली. गुरुवारी पाऊस अपेक्षित — सिंचन आपोआप वगळले जाईल. Zone D मध्ये आत्ता सिंचन सुरू करण्याचा सल्ला."
          }
          label={t.home.aiAdvisory}
        />

        <View style={{ height: Platform.OS === "web" ? 92 : insets.bottom + 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  kpiGrid: { flexDirection: "row", gap: 8 },
  chartCard: {
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  barGroup: { flex: 1, alignItems: "center", gap: 4 },
  barValue: { fontSize: 9 },
  barTrack: {
    width: "100%",
    borderRadius: 4,
    overflow: "hidden",
    justifyContent: "flex-end",
    position: "relative",
  },
  barFill: { borderRadius: 4 },
  rainIcon: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  barLabel: { fontSize: 9, textAlign: "center" },
  zoneCard: {
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  zoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  zoneRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 110,
  },
  zoneTag: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  zoneTagText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  zoneCrop: { fontSize: 12, fontWeight: "500" },
  zoneRowRight: { flex: 1, gap: 3 },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 4 },
  zoneWater: { fontSize: 10 },
  predCard: {
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  predHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  predChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    height: 80,
  },
  predBarGroup: { flex: 1, alignItems: "center", gap: 2 },
  predTrack: {
    flex: 1,
    width: "100%",
    borderRadius: 4,
    overflow: "hidden",
    justifyContent: "flex-end",
    position: "relative",
  },
  predFill: { borderRadius: 4, width: "100%" },
  rainOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  predLabel: { fontSize: 9, textAlign: "center" },
  predVal: { fontSize: 8, textAlign: "center" },
});
