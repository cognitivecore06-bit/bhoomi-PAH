import React from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform, Alert,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useStore, FARMER, Language } from "@/store/useStore";
import { useTranslation } from "@/i18n";
import ScreenHeader from "@/components/ScreenHeader";

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "en", label: "English", native: "English" },
];

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, setLanguage, notifications, toggleNotification } = useStore();
  const t = useTranslation(language);
  const farmer = FARMER;

  const FARM_ROWS = [
    { icon: "home" as const, label: t.settings.farmName, value: language === "en" ? "Shinde Farm" : "शिंदे शेत" },
    { icon: "layers" as const, label: t.settings.cropConfig, value: "4 Crops" },
    { icon: "settings" as const, label: t.settings.sensorCalibration, value: language === "en" ? "Calibrated" : "कॅलिब्रेट केलेले" },
  ];

  const SUPPORT_ROWS = [
    { icon: "help-circle" as const, label: t.settings.help },
    { icon: "phone" as const, label: t.settings.contact },
  ];

  const NOTIF_ROWS = [
    { key: "irrigation" as const, label: t.settings.irrigationAlerts },
    { key: "fertilizer" as const, label: t.settings.fertilizerAlerts },
    { key: "fault" as const, label: t.settings.faultAlerts },
    { key: "weather" as const, label: t.settings.weatherAlerts },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t.settings.title} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: colors.primary, borderRadius: colors.radius }]}>
          <View style={[styles.avatar, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Text style={styles.avatarText}>
              {language === "en" ? farmer.nameEn[0] : farmer.nameMr[0]}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{language === "en" ? farmer.nameEn : farmer.nameMr}</Text>
            <Text style={styles.profileSub}>{language === "en" ? farmer.villageEn : farmer.villageMr}</Text>
            <View style={styles.profileBadges}>
              <View style={[styles.badge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Feather name="map" size={10} color="#fff" />
                <Text style={styles.badgeText}>{language === "en" ? farmer.farmAreaEn : farmer.farmArea}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Feather name="layers" size={10} color="#fff" />
                <Text style={styles.badgeText}>4 Zones</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{t.settings.language}</Text>
          <View style={styles.langGrid}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={[
                  styles.langBtn,
                  {
                    backgroundColor: language === l.code ? colors.primary : colors.background,
                    borderColor: language === l.code ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setLanguage(l.code)}
                activeOpacity={0.8}
              >
                <Text style={[styles.langNative, { color: language === l.code ? "#fff" : colors.foreground }]}>
                  {l.native}
                </Text>
                <Text style={[styles.langSub, { color: language === l.code ? "rgba(255,255,255,0.8)" : colors.mutedForeground }]}>
                  {l.label}
                </Text>
                {language === l.code && (
                  <Feather name="check" size={12} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{t.settings.notifications}</Text>
          {NOTIF_ROWS.map((row) => (
            <View key={row.key} style={[styles.row, { borderBottomColor: colors.border }]}>
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>{row.label}</Text>
              <Switch
                value={notifications[row.key]}
                onValueChange={() => toggleNotification(row.key)}
                trackColor={{ false: colors.border, true: colors.lightGreen + "80" }}
                thumbColor={notifications[row.key] ? colors.primary : colors.mutedForeground}
              />
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{t.settings.farmConfig}</Text>
          {FARM_ROWS.map((row, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.row, { borderBottomColor: colors.border }]}
              activeOpacity={0.8}
            >
              <View style={styles.rowLeft}>
                <Feather name={row.icon} size={16} color={colors.primary} />
                <Text style={[styles.rowLabel, { color: colors.foreground }]}>{row.label}</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>{row.value}</Text>
                <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{t.settings.support}</Text>
          {SUPPORT_ROWS.map((row, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.row, { borderBottomColor: colors.border }]}
              activeOpacity={0.8}
            >
              <View style={styles.rowLeft}>
                <Feather name={row.icon} size={16} color={colors.primary} />
                <Text style={[styles.rowLabel, { color: colors.foreground }]}>{row.label}</Text>
              </View>
              <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.row, { borderBottomWidth: 0 }]}
            activeOpacity={0.8}
            onPress={() => {
              Alert.alert(
                language === "en" ? "Logout" : "बाहेर पडा",
                language === "en" ? "Are you sure?" : "खात्री आहे का?",
                [
                  { text: language === "en" ? "Cancel" : "रद्द करा", style: "cancel" },
                  { text: language === "en" ? "Logout" : "बाहेर पडा", onPress: () => router.replace("/login") },
                ]
              );
            }}
          >
            <View style={styles.rowLeft}>
              <Feather name="log-out" size={16} color={colors.danger} />
              <Text style={[styles.rowLabel, { color: colors.danger }]}>{t.settings.logout}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          Bhoomi v1.0 · भूमी Smart Irrigation
        </Text>

        <View style={{ height: Platform.OS === "web" ? 92 : insets.bottom + 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  profileCard: {
    flexDirection: "row",
    padding: 16,
    gap: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 24, fontWeight: "800" },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { color: "#fff", fontSize: 18, fontWeight: "700" },
  profileSub: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
  profileBadges: { flexDirection: "row", gap: 6, marginTop: 4 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "600" },
  section: {
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  langGrid: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  langBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 2,
  },
  langNative: { fontSize: 15, fontWeight: "700" },
  langSub: { fontSize: 9 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 0.5,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowLabel: { fontSize: 14, fontWeight: "500" },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowValue: { fontSize: 13 },
  version: {
    fontSize: 11,
    textAlign: "center",
    paddingBottom: 4,
  },
});
