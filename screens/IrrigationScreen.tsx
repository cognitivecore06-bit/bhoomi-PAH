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
import ValveToggle from "@/components/ValveToggle";

export default function IrrigationScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, zones, toggleValve, irrigationMode, setIrrigationMode } = useStore();
  const t = useTranslation(language);
  const [micActive, setMicActive] = useState(false);

  const criticalZone = zones.find((z) => z.status === "critical");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t.irrigation.title} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[
              styles.modeCard,
              {
                backgroundColor: irrigationMode === "auto" ? colors.primary : colors.card,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setIrrigationMode("auto")}
            activeOpacity={0.8}
          >
            <Feather name="cpu" size={28} color={irrigationMode === "auto" ? "#fff" : colors.primary} />
            <Text style={[styles.modeTitle, { color: irrigationMode === "auto" ? "#fff" : colors.foreground }]}>
              {t.irrigation.autoMode}
            </Text>
            <Text style={[styles.modeDesc, { color: irrigationMode === "auto" ? "rgba(255,255,255,0.8)" : colors.mutedForeground }]}>
              {t.irrigation.autoDesc}
            </Text>
            {irrigationMode === "auto" && (
              <View style={[styles.activeChip, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
                <Feather name="check" size={10} color="#fff" />
                <Text style={styles.activeChipText}>Active</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeCard,
              {
                backgroundColor: irrigationMode === "manual" ? colors.soilBrown : colors.card,
                borderColor: colors.soilBrown,
              },
            ]}
            onPress={() => setIrrigationMode("manual")}
            activeOpacity={0.8}
          >
            <Feather name="sliders" size={28} color={irrigationMode === "manual" ? "#fff" : colors.soilBrown} />
            <Text style={[styles.modeTitle, { color: irrigationMode === "manual" ? "#fff" : colors.foreground }]}>
              {t.irrigation.manualMode}
            </Text>
            <Text style={[styles.modeDesc, { color: irrigationMode === "manual" ? "rgba(255,255,255,0.8)" : colors.mutedForeground }]}>
              {t.irrigation.manualDesc}
            </Text>
            {irrigationMode === "manual" && (
              <View style={[styles.activeChip, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
                <Feather name="check" size={10} color="#fff" />
                <Text style={styles.activeChipText}>Active</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          {language === "en" ? "Zone Valve Control" : "झोन झडप नियंत्रण"}
        </Text>

        {zones.map((zone) => (
          <ValveToggle
            key={zone.id}
            zone={zone}
            cropLabel={language === "en" ? zone.cropEn : zone.cropMr}
            givenText={t.irrigation.waterGiven}
            neededText={t.irrigation.waterNeeded}
            onToggle={() => toggleValve(zone.id)}
          />
        ))}

        <View style={[styles.voiceCard, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}>
          <View style={styles.voiceHeader}>
            <Feather name="mic" size={16} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t.irrigation.voiceCommand}</Text>
          </View>
          <Text style={[styles.voiceHint, { color: colors.mutedForeground }]}>{t.irrigation.voiceHint}</Text>
          <TouchableOpacity
            style={[styles.micBtn, { backgroundColor: micActive ? colors.danger : colors.primary }]}
            onPress={() => setMicActive(!micActive)}
            activeOpacity={0.8}
          >
            <Feather name={micActive ? "mic-off" : "mic"} size={28} color="#fff" />
          </TouchableOpacity>
          {micActive && (
            <View style={[styles.listeningBadge, { backgroundColor: colors.dangerBg }]}>
              <View style={[styles.pulseDot, { backgroundColor: colors.danger }]} />
              <Text style={[styles.listeningText, { color: colors.danger }]}>
                {language === "en" ? "Listening..." : "ऐकत आहे..."}
              </Text>
            </View>
          )}
        </View>

        {criticalZone && (
          <TouchableOpacity
            style={[styles.emergencyBtn, { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}
            onPress={() => toggleValve(criticalZone.id)}
            activeOpacity={0.8}
          >
            <Feather name="alert-triangle" size={18} color={colors.danger} />
            <Text style={[styles.emergencyText, { color: colors.danger }]}>{t.irrigation.emergency}</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: Platform.OS === "web" ? 92 : insets.bottom + 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  modeRow: {
    flexDirection: "row",
    gap: 10,
  },
  modeCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2,
    padding: 16,
    gap: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  modeDesc: {
    fontSize: 11,
    textAlign: "center",
  },
  activeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  activeChipText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  voiceCard: {
    padding: 16,
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  voiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  voiceHint: {
    fontSize: 12,
    textAlign: "center",
  },
  micBtn: {
    borderRadius: 40,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  listeningBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  listeningText: {
    fontSize: 13,
    fontWeight: "600",
  },
  emergencyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
  },
  emergencyText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
