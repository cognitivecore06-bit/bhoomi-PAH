import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore, FARMER, SOLAR_DATA } from "@/store/useStore";
import { useWeather } from "@/hooks/useWeather";
import WeatherModal from "@/components/WeatherModal";

const ZONE_STYLES: Record<string, { border: string; bg: string; text: string; bar: string }> = {
  good:     { border: "#2E7D32", bg: "#E8F5E9", text: "#2E7D32", bar: "#4CAF50" },
  warning:  { border: "#E65100", bg: "#FFF3E0", text: "#E65100", bar: "#FF8F00" },
  critical: { border: "#C62828", bg: "#FFEBEE", text: "#C62828", bar: "#EF5350" },
};

const QUICK_ACTIONS = [
  { bgColor: "#1B5E20", label: "सिंचन · Irrigation",  icon: "droplet"     as const, route: "/(tabs)/irrigation" },
  { bgColor: "#1565C0", label: "खत · Fertigation",    icon: "bar-chart-2" as const, route: "/(tabs)/fertigation" },
  { bgColor: "#E65100", label: "Solar Energy",         icon: "sun"         as const, route: "/(tabs)/analytics" },
  { bgColor: "#424242", label: "सूचना · Alerts",       icon: "bell"        as const, route: "/(tabs)/alerts" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { zones, alerts } = useStore();
  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const unread = alerts.filter((a) => !a.read).length;
  const farmer = FARMER;
  const firstName = farmer.nameMr.split(" ")[0];

  const { weather, loading: weatherLoading, error: weatherError, locationLabel } = useWeather();
  const [showWeatherModal, setShowWeatherModal] = useState(false);

  const currentCondition = weather?.current.condition;
  const currentTemp = weather?.current.temperature;
  const rainDayShort = weather?.rainDayShort;

  const weatherPillText = weatherLoading && !weather
    ? "Loading…"
    : currentTemp !== undefined && currentCondition
    ? `${currentTemp}°C · ${currentCondition.label}`
    : "29°C · Sunny";

  const rainText = weatherLoading && !weather
    ? "Fetching forecast…"
    : rainDayShort
    ? `Rain: ${rainDayShort} · Check forecast`
    : "No rain expected · Good week";

  return (
    <>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* ── HEADER ── */}
        <View style={[styles.header, { paddingTop: topPad + 14 }]}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>नमस्कार, {firstName} 🌱</Text>
              <Text style={styles.subGreeting}>Vadale Farm · 4 Zones · 4 Acre</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/alerts")}
              style={styles.bellBtn}
            >
              <Feather name="bell" size={20} color="#fff" />
              {unread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.weatherRow}>
            <TouchableOpacity
              style={styles.weatherPill}
              onPress={() => setShowWeatherModal(true)}
              activeOpacity={0.75}
            >
              {weatherLoading && !weather ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.weatherPillEmoji}>
                  {currentCondition?.emoji ?? "☀️"}
                </Text>
              )}
              <Text style={styles.weatherPillText}>{weatherPillText}</Text>
              <Feather name="chevron-right" size={12} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
            <Text style={styles.rainText}>{rainText}</Text>
          </View>
        </View>

        {/* ── CONTENT ── */}
        <View style={styles.content}>

          {/* AI ADVISORY BANNER */}
          <TouchableOpacity
            style={styles.aiBanner}
            onPress={() => router.push("/(tabs)/analytics")}
            activeOpacity={0.88}
          >
            <View style={styles.aiBannerInner}>
              <View style={styles.aiIconCircle}>
                <Feather name="cpu" size={17} color="#2E7D32" />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={styles.aiMainText}>
                  <Text style={styles.aiBold}>AI: </Text>
                  आज सिंचन सुरू करा Zone B आणि D साठी
                </Text>
                <Text style={styles.aiSubText}>
                  Moisture below 30% · Tap to view plan
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* STATS ROW */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#1565C0" }]}>1.2k</Text>
              <Text style={styles.statLabel}>L Used</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#2E7D32" }]}>24%</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#E65100" }]}>
                {SOLAR_DATA.battery}%
              </Text>
              <Text style={styles.statLabel}>Battery</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: unread > 0 ? "#C62828" : "#2E7D32" }]}>
                {unread}
              </Text>
              <Text style={styles.statLabel}>Alerts</Text>
            </View>
          </View>

          {/* FIELD ZONES */}
          <Text style={styles.sectionTitle}>FIELD ZONES</Text>
          <View style={styles.zonesGrid}>
            {zones.map((zone) => {
              const s = ZONE_STYLES[zone.status];
              const isCritical = zone.status === "critical";
              const valveLabel = isCritical
                ? "CRITICAL · Alert sent"
                : zone.valveStatus === "on"
                ? "Moisture · Valve ON"
                : "Moisture · Valve OFF";
              return (
                <TouchableOpacity
                  key={zone.id}
                  style={[styles.zoneCard, { borderColor: s.border, backgroundColor: s.bg }]}
                  onPress={() => router.push("/(tabs)/zones")}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.zoneTitle, { color: s.text }]}>
                    {zone.name} · {zone.cropEn}
                  </Text>
                  <Text style={[styles.zoneMoisture, { color: s.text }]}>
                    {zone.moisture}%
                  </Text>
                  <Text style={styles.zoneStatus}>{valveLabel}</Text>
                  <View style={[styles.moistureTrack, { backgroundColor: s.border + "30" }]}>
                    <View
                      style={[
                        styles.moistureFill,
                        { width: `${zone.moisture}%` as any, backgroundColor: s.bar },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* QUICK ACTIONS */}
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((a) => (
              <TouchableOpacity
                key={a.label}
                style={[styles.actionBtn, { backgroundColor: a.bgColor }]}
                onPress={() => router.push(a.route as any)}
                activeOpacity={0.85}
              >
                <Feather name={a.icon} size={28} color="#fff" />
                <Text style={styles.actionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* AI ADVISOR BOTTOM CARD */}
          <View style={styles.aiBottomCard}>
            <View style={styles.aiBottomAccent} />
            <Text style={styles.aiBottomText}>
              AI Advisor: Zone D (Tomato) ला आता 390 लीटर पाणी द्या. मी valve आपोआप उघडत आहे.
            </Text>
          </View>

        </View>

        <View style={{ height: Platform.OS === "web" ? 92 : insets.bottom + 80 }} />
      </ScrollView>

      <WeatherModal
        visible={showWeatherModal}
        onClose={() => setShowWeatherModal(false)}
        weather={weather}
        loading={weatherLoading}
        error={weatherError}
        locationLabel={locationLabel}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  /* HEADER */
  header: {
    backgroundColor: "#1a5c2a",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  greeting: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  subGreeting: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 2,
  },
  bellBtn: {
    position: "relative",
    padding: 4,
    marginTop: 2,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#E53935",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  weatherPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  weatherPillEmoji: {
    fontSize: 13,
  },
  weatherPillText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  rainText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    fontWeight: "500",
    flexShrink: 1,
    textAlign: "right",
  },

  /* CONTENT */
  content: {
    padding: 14,
    gap: 14,
  },

  /* AI ADVISORY BANNER */
  aiBanner: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  aiBannerInner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  aiIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#C8E6C9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  aiBold: {
    fontWeight: "800",
    color: "#1B5E20",
  },
  aiMainText: {
    fontSize: 13,
    color: "#2E7D32",
    fontWeight: "600",
    lineHeight: 18,
  },
  aiSubText: {
    fontSize: 11,
    color: "#558B2F",
    fontWeight: "400",
  },

  /* STATS ROW */
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 10,
    color: "#757575",
    fontWeight: "500",
    marginTop: 2,
    textAlign: "center",
  },

  /* SECTION TITLE */
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#333",
    letterSpacing: 0.8,
  },

  /* FIELD ZONES */
  zonesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  zoneCard: {
    width: "48%" as any,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  zoneTitle: {
    fontSize: 12,
    fontWeight: "700",
  },
  zoneMoisture: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 32,
  },
  zoneStatus: {
    fontSize: 10,
    color: "#555",
    fontWeight: "500",
  },
  moistureTrack: {
    height: 5,
    borderRadius: 4,
    marginTop: 4,
    overflow: "hidden",
  },
  moistureFill: {
    height: 5,
    borderRadius: 4,
  },

  /* QUICK ACTIONS */
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionBtn: {
    width: "48%" as any,
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  actionLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },

  /* AI BOTTOM CARD */
  aiBottomCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  aiBottomAccent: {
    width: 4,
    borderRadius: 2,
    backgroundColor: "#4CAF50",
    alignSelf: "stretch",
  },
  aiBottomText: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    lineHeight: 20,
    fontWeight: "500",
  },
});
