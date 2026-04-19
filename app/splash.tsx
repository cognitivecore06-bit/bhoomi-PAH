import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

const BADGE_INFO = [
  {
    id: "zones",
    icon: "map" as const,
    title: "4 Zones",
    titleMr: "४ झोन",
    description:
      "Your farm is divided into 4 smart irrigation zones — Zone A, B, C, and D. Each zone is independently controlled for precision watering based on crop type and soil moisture.",
  },
  {
    id: "ai",
    icon: "cpu" as const,
    title: "AI Powered",
    titleMr: "AI चालित",
    description:
      "Bhoomi uses AI to analyze weather forecasts, soil data, and crop growth stages to recommend optimal irrigation schedules, reducing water usage by up to 40%.",
  },
  {
    id: "solar",
    icon: "sun" as const,
    title: "Solar Energy",
    titleMr: "सौर ऊर्जा",
    description:
      "A 2.4 kW solar panel system powers the entire irrigation infrastructure. Track real-time generation, battery status, and daily energy savings from the Solar screen.",
  },
];

export default function SplashScreen() {
  const colors = useColors();
  const [activeBadge, setActiveBadge] = useState<
    (typeof BADGE_INFO)[0] | null
  >(null);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.primary }]}
    >
      <View style={styles.inner}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Feather name="feather" size={48} color="#fff" />
          </View>

          <Text style={styles.appName}>BHOOMI</Text>
          <Text style={styles.appNameMr}>भूमि</Text>

          <Text style={styles.tagline}>
            Smart Irrigation · AI Farming · Solar Power
          </Text>
        </View>

        <View style={styles.badgesRow}>
          {BADGE_INFO.map((badge) => (
            <TouchableOpacity
              key={badge.id}
              style={styles.badge}
              activeOpacity={0.75}
              onPress={() => setActiveBadge(badge)}
            >
              <Feather name={badge.icon} size={20} color="#fff" />
              <Text style={styles.badgeTitle}>{badge.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.getStartedBtn}
          activeOpacity={0.85}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.getStartedText}>शुरू करा · Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Marathi · हिंदी · English supported</Text>
      </View>

      <Modal
        visible={activeBadge !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveBadge(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveBadge(null)}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={() => {}}
          >
            {activeBadge && (
              <>
                <View style={[styles.modalIcon, { backgroundColor: colors.primary }]}>
                  <Feather name={activeBadge.icon} size={28} color="#fff" />
                </View>
                <Text style={[styles.modalTitle, { color: colors.primary }]}>
                  {activeBadge.title}
                </Text>
                <Text style={[styles.modalTitleMr, { color: colors.mutedForeground }]}>
                  {activeBadge.titleMr}
                </Text>
                <Text style={styles.modalDesc}>{activeBadge.description}</Text>
                <TouchableOpacity
                  style={[styles.modalClose, { backgroundColor: colors.primary }]}
                  onPress={() => setActiveBadge(null)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 36,
  },
  logoSection: {
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "center",
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  appName: {
    color: "#fff",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 6,
  },
  appNameMr: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 1,
  },
  tagline: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 12,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginBottom: 24,
  },
  badge: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  badgeTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  getStartedBtn: {
    backgroundColor: "#fff",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  getStartedText: {
    color: "#1B5E20",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  footer: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  modalTitleMr: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalDesc: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 4,
  },
  modalClose: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 10,
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
