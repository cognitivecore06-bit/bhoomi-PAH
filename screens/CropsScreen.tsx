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
import AIBubble from "@/components/AIBubble";

const GROWTH_STAGES_COUNT = 7;
const STAGE_MAP: Record<string, number> = {
  "Sowing": 0,
  "Germination": 1,
  "Seedling": 2,
  "Tillering": 3,
  "Flowering": 4,
  "Grand Growth": 4,
  "Bulb Formation": 5,
  "Fruiting": 5,
  "Harvest": 6,
};

const CROP_AI: Record<string, { mr: string; en: string }> = {
  A: {
    mr: "गहू वाढीसाठी नत्र (युरिया) ताबडतोब द्या. आठवड्यातून तीन वेळा सिंचन करा. पाऊस गुरुवारी असल्याने बुधवारी सिंचन करा.",
    en: "Apply Urea (Nitrogen) immediately for wheat growth. Irrigate 3 times a week. Due to Thursday rain, schedule irrigation on Wednesday.",
  },
  B: {
    mr: "उसाला या काळात जास्त पाणी लागते. स्फुरद (P) उच्च असल्याने DAP टाळा. आठवड्यातून ५ वेळा सिंचन करा.",
    en: "Sugarcane needs more water during grand growth. Avoid DAP as Phosphorus is high. Irrigate 5 times a week.",
  },
  C: {
    mr: "कांदा कंद तयार होत आहे — पोटॅश (K) तातडीने द्या. जास्त ओलावा टाळा. आठवड्यातून ४ वेळा सिंचन करा.",
    en: "Onion bulb is forming — apply Potash (K) urgently. Avoid overwatering. Irrigate 4 times a week.",
  },
  D: {
    mr: "टोमॅटो फुलोऱ्यात आहे — गंभीर दुष्काळ आहे. आत्ता सिंचन करा. NPK सर्व कमी — युरिया, DAP, पोटॅश द्या.",
    en: "Tomato is flowering — critical drought. Irrigate now. All NPK low — apply Urea, DAP, and Potash urgently.",
  },
};

const SCHEDULE = [
  ["सोम", "Mon", "200L"],
  ["मंगळ", "Tue", "-"],
  ["बुध", "Wed", "200L"],
  ["गुरु", "Thu", "पाऊस / Rain"],
  ["शुक्र", "Fri", "200L"],
  ["शनि", "Sat", "-"],
  ["रवि", "Sun", "180L"],
];

export default function CropsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, zones } = useStore();
  const t = useTranslation(language);
  const [selectedZone, setSelectedZone] = useState("A");
  const zone = zones.find((z) => z.id === selectedZone)!;
  const stageIdx = STAGE_MAP[zone.growthStage] ?? 3;
  const ai = CROP_AI[selectedZone];

  const getHealthColor = (h: number) => {
    if (h >= 80) return colors.lightGreen;
    if (h >= 60) return colors.warning;
    return colors.danger;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t.crops.title} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          <View style={styles.chipRow}>
            {zones.map((z) => (
              <TouchableOpacity
                key={z.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selectedZone === z.id ? z.color : colors.card,
                    borderColor: z.color,
                  },
                ]}
                onPress={() => setSelectedZone(z.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, { color: selectedZone === z.id ? "#fff" : z.color }]}>
                  {language === "en" ? z.cropEn : z.cropMr}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.cropCard, { backgroundColor: zone.bgColor, borderRadius: colors.radius, borderColor: zone.color, borderWidth: 1.5 }]}>
          <View style={styles.cropHeader}>
            <View style={[styles.cropIcon, { backgroundColor: zone.color }]}>
              <Feather name="feather" size={22} color="#fff" />
            </View>
            <View style={styles.cropInfo}>
              <Text style={[styles.cropName, { color: zone.color }]}>
                {language === "en" ? zone.cropEn : zone.cropMr}
              </Text>
              <Text style={[styles.cropZone, { color: colors.mutedForeground }]}>{zone.name}</Text>
            </View>
            <View style={[styles.healthBadge, { backgroundColor: getHealthColor(zone.health) }]}>
              <Text style={styles.healthText}>{zone.health}/100</Text>
            </View>
          </View>

          <View>
            <View style={styles.stagesHeader}>
              <Text style={[styles.stageLabel, { color: colors.foreground }]}>{t.crops.growthStage}</Text>
              <Text style={[styles.stageCurrent, { color: zone.color }]}>
                {language === "en" ? zone.growthStage : zone.growthStageMr}
              </Text>
            </View>
            <View style={styles.stageTrack}>
              {Array.from({ length: GROWTH_STAGES_COUNT }).map((_, i) => (
                <View key={i} style={[styles.stageSegment, {
                  backgroundColor: i <= stageIdx ? zone.color : colors.border + "60"
                }]} />
              ))}
            </View>
            <View style={styles.stageLabels}>
              {t.crops.stages.map((s, i) => (
                <Text key={i} style={[styles.stageTick, { color: i === stageIdx ? zone.color : colors.mutedForeground }]}>
                  {s.slice(0, 3)}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricTile, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            <Feather name="droplet" size={18} color={colors.skyBlue} />
            <Text style={[styles.metricValue, { color: colors.foreground }]}>{zone.waterNeeded}L</Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{t.crops.waterNeeded}</Text>
          </View>
          <View style={[styles.metricTile, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            <Feather name="calendar" size={18} color={colors.primary} />
            <Text style={[styles.metricValue, { color: colors.foreground }]}>{zone.daysToHarvest}</Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{t.crops.daysToHarvest}</Text>
          </View>
          <View style={[styles.metricTile, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            <Feather name="trending-up" size={18} color={colors.wheatGold} />
            <Text style={[styles.metricValue, { color: colors.foreground }]} numberOfLines={1}>{zone.yieldForecast}</Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{t.crops.yieldForecast}</Text>
          </View>
          <View style={[styles.metricTile, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            <Feather name="heart" size={18} color={getHealthColor(zone.health)} />
            <Text style={[styles.metricValue, { color: getHealthColor(zone.health) }]}>{zone.health}%</Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{t.crops.health}</Text>
          </View>
        </View>

        <AIBubble
          message={language === "en" ? ai.en : ai.mr}
          label={t.crops.aiAdvisory}
        />

        <View style={[styles.scheduleCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.scheduleTitle, { color: colors.foreground }]}>{t.crops.schedule}</Text>
          {SCHEDULE.map(([mr, en, water]) => (
            <View key={en} style={[styles.schedRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.schedDay, { color: colors.foreground }]}>
                {language === "en" ? en : mr}
              </Text>
              <View style={[styles.schedWater, {
                backgroundColor: water === "-" ? colors.background : water.includes("Rain") ? colors.infoBg : zone.bgColor
              }]}>
                <Text style={[styles.schedWaterText, {
                  color: water === "-" ? colors.mutedForeground : water.includes("Rain") ? colors.skyBlue : zone.color
                }]}>
                  {water}
                </Text>
              </View>
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
  content: { padding: 16, gap: 12 },
  chipScroll: { marginBottom: 4 },
  chipRow: { flexDirection: "row", gap: 8, paddingBottom: 4 },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1.5,
  },
  chipText: { fontSize: 13, fontWeight: "700" },
  cropCard: { padding: 14, gap: 12 },
  cropHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  cropIcon: { borderRadius: 20, padding: 10 },
  cropInfo: { flex: 1 },
  cropName: { fontSize: 20, fontWeight: "800" },
  cropZone: { fontSize: 12 },
  healthBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  healthText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  stagesHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  stageLabel: { fontSize: 12, fontWeight: "600" },
  stageCurrent: { fontSize: 12, fontWeight: "700" },
  stageTrack: { flexDirection: "row", gap: 3, height: 8 },
  stageSegment: { flex: 1, borderRadius: 4 },
  stageLabels: { flexDirection: "row", marginTop: 4 },
  stageTick: { flex: 1, fontSize: 8, textAlign: "center" },
  metricsGrid: { flexDirection: "row", gap: 8 },
  metricTile: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  metricValue: { fontSize: 15, fontWeight: "700", textAlign: "center" },
  metricLabel: { fontSize: 9, textAlign: "center" },
  scheduleCard: {
    padding: 14,
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  scheduleTitle: { fontSize: 14, fontWeight: "700", marginBottom: 6 },
  schedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  schedDay: { fontSize: 13, fontWeight: "500" },
  schedWater: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  schedWaterText: { fontSize: 12, fontWeight: "600" },
});
