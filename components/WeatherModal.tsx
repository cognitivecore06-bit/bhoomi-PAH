import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { WeatherData, DayForecast } from "@/hooks/useWeather";

interface WeatherModalProps {
  visible: boolean;
  onClose: () => void;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  locationLabel: string;
}

function ForecastRow({ day }: { day: DayForecast }) {
  return (
    <View style={styles.forecastRow}>
      <Text style={styles.forecastDay}>{day.shortDay}</Text>
      <Text style={styles.forecastEmoji}>{day.condition.emoji}</Text>
      <View style={styles.forecastTemps}>
        <Text style={styles.forecastMax}>{day.maxTemp}°</Text>
        <Text style={styles.forecastMin}>{day.minTemp}°</Text>
      </View>
      <View style={styles.forecastRainContainer}>
        <Feather name="droplet" size={11} color="#1565C0" />
        <Text style={styles.forecastRain}>
          {day.rainProbability > 0
            ? `${Math.round(day.rainProbability * 100)}%`
            : "—"}
        </Text>
      </View>
      <View
        style={[
          styles.farmingBadge,
          { backgroundColor: day.goodForFarming ? "#E8F5E9" : "#FFEBEE" },
        ]}
      >
        <Text
          style={[
            styles.farmingBadgeText,
            { color: day.goodForFarming ? "#2E7D32" : "#C62828" },
          ]}
        >
          {day.goodForFarming ? "✓ Farm" : "⚠ Rain"}
        </Text>
      </View>
    </View>
  );
}

export default function WeatherModal({
  visible,
  onClose,
  weather,
  loading,
  error,
  locationLabel,
}: WeatherModalProps) {
  const insets = useSafeAreaInsets();
  const current = weather?.current;
  const today = weather?.daily?.[0];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View
        style={[
          styles.sheet,
          { paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 16 },
        ]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Title row */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>🌤 Weather Forecast</Text>
            <Text style={styles.subtitle}>📍 {locationLabel}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        {loading && !weather ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={styles.loadingText}>Fetching weather data…</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* TODAY DETAILS */}
            {current && today && (
              <View style={styles.todayCard}>
                <View style={styles.todayHeader}>
                  <Text style={styles.todayLabel}>TODAY</Text>
                  {error && (
                    <Text style={styles.offlineTag}>⚠ Cached data</Text>
                  )}
                </View>
                <View style={styles.todayMain}>
                  <Text style={styles.todayEmoji}>{current.condition.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.todayTemp}>{current.temperature}°C</Text>
                    <Text style={styles.todayCondition}>{current.condition.label}</Text>
                  </View>
                  <View style={styles.todayStats}>
                    <View style={styles.todayStat}>
                      <Feather name="wind" size={13} color="#666" />
                      <Text style={styles.todayStatText}>{current.windSpeed} km/h</Text>
                    </View>
                    <View style={styles.todayStat}>
                      <Feather name="thermometer" size={13} color="#666" />
                      <Text style={styles.todayStatText}>
                        {today.maxTemp}° / {today.minTemp}°
                      </Text>
                    </View>
                    <View style={styles.todayStat}>
                      <Feather name="droplet" size={13} color="#1565C0" />
                      <Text style={styles.todayStatText}>
                        {today.precipitation > 0
                          ? `${today.precipitation}mm rain`
                          : "No rain"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.farmingToday,
                    {
                      backgroundColor: today.goodForFarming ? "#E8F5E9" : "#FFEBEE",
                      borderColor: today.goodForFarming ? "#A5D6A7" : "#FFCDD2",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: today.goodForFarming ? "#2E7D32" : "#C62828",
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                  >
                    {today.goodForFarming
                      ? "✓ Good day for farming & irrigation"
                      : "✗ Not ideal — consider postponing field work"}
                  </Text>
                </View>
              </View>
            )}

            {/* 7-DAY FORECAST */}
            {weather && weather.daily.length > 0 && (
              <View style={styles.forecastSection}>
                <Text style={styles.forecastTitle}>7-DAY FORECAST</Text>
                <View style={styles.forecastHeader}>
                  <Text style={[styles.forecastHeaderText, { flex: 0.7 }]}>Day</Text>
                  <Text style={[styles.forecastHeaderText, { flex: 0.5 }]}></Text>
                  <Text style={[styles.forecastHeaderText, { flex: 1 }]}>Temp</Text>
                  <Text style={[styles.forecastHeaderText, { flex: 0.8 }]}>Rain%</Text>
                  <Text style={[styles.forecastHeaderText, { flex: 1 }]}>Farming</Text>
                </View>
                {weather.daily.map((day) => (
                  <ForecastRow key={day.dateStr} day={day} />
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    maxHeight: "82%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDD",
    alignSelf: "center",
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1B5E20",
  },
  subtitle: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    color: "#666",
    fontSize: 14,
  },

  /* TODAY CARD */
  todayCard: {
    backgroundColor: "#F1F8E9",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#C5E1A5",
    gap: 12,
  },
  todayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  todayLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#558B2F",
    letterSpacing: 1,
  },
  offlineTag: {
    fontSize: 10,
    color: "#E65100",
    fontWeight: "600",
  },
  todayMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  todayEmoji: {
    fontSize: 42,
  },
  todayTemp: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1B5E20",
    lineHeight: 40,
  },
  todayCondition: {
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
  },
  todayStats: {
    gap: 6,
  },
  todayStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  todayStatText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
  },
  farmingToday: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
  },

  /* 7-DAY FORECAST */
  forecastSection: {
    marginBottom: 8,
  },
  forecastTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#555",
    letterSpacing: 1,
    marginBottom: 8,
  },
  forecastHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    marginBottom: 4,
  },
  forecastHeaderText: {
    fontSize: 10,
    color: "#999",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  forecastRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  forecastDay: {
    flex: 0.7,
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
  },
  forecastEmoji: {
    flex: 0.5,
    fontSize: 18,
  },
  forecastTemps: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
  },
  forecastMax: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E65100",
  },
  forecastMin: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1565C0",
  },
  forecastRainContainer: {
    flex: 0.8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  forecastRain: {
    fontSize: 12,
    color: "#1565C0",
    fontWeight: "500",
  },
  farmingBadge: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: "center",
  },
  farmingBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
});
