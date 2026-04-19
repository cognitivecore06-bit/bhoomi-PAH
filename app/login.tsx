import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  useWindowDimensions,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useStore, Language } from "@/store/useStore";
import { auth } from "@/firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

const LANGUAGES: { code: Language; native: string }[] = [
  { code: "mr", native: "मराठी" },
  { code: "hi", native: "हिंदी" },
  { code: "en", native: "English" },
];

const LOGIN_STRINGS: Record<Language, {
  welcomeSmall: string;
  title: string;
  subtitle: string;
  mobileLabel: string;
  otpLabel: string;
  otpSent: (mobile: string) => string;
  langLabel: string;
  loginBtn: string;
  resend: string;
  resendCountdown: (t: string) => string;
  registerLabel: string;
  registerLink: string;
}> = {
  mr: {
    welcomeSmall: "स्वागत आहे · Welcome",
    title: "Login to Bhoomi",
    subtitle: "OTP द्वारे लॉगिन · Login via OTP",
    mobileLabel: "मोबाइल नंबर",
    otpLabel: "OTP नमूद करा",
    otpSent: (m) => `OTP ${m} वर पाठवला`,
    langLabel: "भाषा निवडा · Select Language",
    loginBtn: "लॉगिन करा · Verify & Login",
    resend: "पुन्हा OTP मिळवा",
    resendCountdown: (t) => `पुन्हा OTP मिळवा (${t})`,
    registerLabel: "नवीन शेतकरी?",
    registerLink: "नोंदणी करा",
  },
  hi: {
    welcomeSmall: "स्वागत है · Welcome",
    title: "Login to Bhoomi",
    subtitle: "OTP द्वारे लॉगिन · Login via OTP",
    mobileLabel: "मोबाइल नंबर",
    otpLabel: "OTP दर्ज करें",
    otpSent: (m) => `OTP ${m} पर भेजा गया`,
    langLabel: "भाषा चुनें · Select Language",
    loginBtn: "लॉगिन करें · Verify & Login",
    resend: "OTP दोबारा भेजें",
    resendCountdown: (t) => `OTP दोबारा भेजें (${t})`,
    registerLabel: "नए किसान?",
    registerLink: "पंजीकरण करें",
  },
  en: {
    welcomeSmall: "Welcome",
    title: "Login to Bhoomi",
    subtitle: "Login via OTP",
    mobileLabel: "Mobile Number",
    otpLabel: "Enter OTP",
    otpSent: (m) => `OTP sent to ${m}`,
    langLabel: "Select Language",
    loginBtn: "Verify & Login",
    resend: "Resend OTP",
    resendCountdown: (t) => `Resend OTP (${t})`,
    registerLabel: "New Farmer?",
    registerLink: "Register",
  },
};

const COUNTDOWN_START = 42;

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useStore();
  const s = LOGIN_STRINGS[language];

  const { width: windowWidth } = useWindowDimensions();
  const otpBoxSize = Math.floor((windowWidth - 120) / 4);

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [canResend, setCanResend] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const recaptchaVerifierRef = useRef<any>(null);
  const topPad = Platform.OS === "web" ? 0 : insets.top;

  const otpFilled = otp.every((d) => d !== "");

  useEffect(() => {
    if (Platform.OS === "web") {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  }, []);

  useEffect(() => {
    if (mobile.length === 10) {
      sendOtp();
    }
  }, [mobile]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (val: string, idx: number) => {
    const next = [...otp];
    next[idx] = val.replace(/[^0-9]/g, "").slice(-1);
    setOtp(next);
    if (val && idx < 3) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKey = (e: any, idx: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const sendOtp = async () => {
    try {
      const phoneNumber = `+91${mobile}`;
      const appVerifier = Platform.OS === "web" ? recaptchaVerifierRef.current : undefined;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setCountdown(COUNTDOWN_START);
      setCanResend(false);
    } catch (error: any) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setOtp(["", "", "", ""]);
    setCountdown(COUNTDOWN_START);
    setCanResend(false);
    otpRefs.current[0]?.focus();
    await sendOtp();
  };

  const verify = async () => {
    if (!otpFilled) return;
    const otpCode = otp.join("");
    if (confirmationResult) {
      try {
        await confirmationResult.confirm(otpCode);
        router.replace("/(tabs)");
      } catch (error) {
        Alert.alert("Wrong OTP", "Wrong OTP. Please try again.");
      }
    } else {
      router.replace("/(tabs)");
    }
  };

  const padded = (n: number) => String(n).padStart(2, "0");
  const countdownDisplay = `${padded(Math.floor(countdown / 60))}:${padded(countdown % 60)}`;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.header,
            { backgroundColor: colors.primary, paddingTop: topPad + 20 },
          ]}
        >
          <Text style={styles.headerWelcome}>{s.welcomeSmall}</Text>
          <Text style={styles.headerTitle}>{s.title}</Text>
          <Text style={styles.headerSub}>{s.subtitle}</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.fieldLabel}>{s.mobileLabel}</Text>
          <View style={[styles.mobileRow, { borderColor: colors.border }]}>
            <View style={[styles.prefixBox, { borderRightColor: colors.border }]}>
              <Text style={[styles.prefixText, { color: colors.foreground }]}>
                +91
              </Text>
            </View>
            <TextInput
              style={[styles.mobileInput, { color: colors.foreground }]}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="9876543210"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>

          <View style={[styles.otpContainer, { backgroundColor: colors.paleGreen, borderColor: colors.lightGreen }]}>
            <Text style={[styles.fieldLabel, { color: colors.mediumGreen }]}>
              {s.otpLabel}
            </Text>
            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(r) => {
                    otpRefs.current[i] = r;
                  }}
                  style={[
                    styles.otpBox,
                    {
                      width: otpBoxSize,
                      height: otpBoxSize,
                      borderColor: digit ? colors.primary : colors.border,
                      color: colors.foreground,
                      backgroundColor: "#fff",
                    },
                  ]}
                  value={digit}
                  onChangeText={(v) => handleOtpChange(v, i)}
                  onKeyPress={(e) => handleOtpKey(e, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                />
              ))}
            </View>
            {mobile.length >= 10 && (
              <Text style={[styles.otpSentText, { color: colors.mediumGreen }]}>
                {s.otpSent(mobile)}
              </Text>
            )}
          </View>

          <View style={[styles.langContainer, { borderColor: colors.border }]}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
              {s.langLabel}
            </Text>
            <View style={styles.langRow}>
              {LANGUAGES.map((l) => (
                <TouchableOpacity
                  key={l.code}
                  style={[
                    styles.langPill,
                    language === l.code
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : { backgroundColor: "#fff", borderColor: colors.border },
                  ]}
                  onPress={() => setLanguage(l.code)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.langText,
                      { color: language === l.code ? "#fff" : colors.foreground },
                    ]}
                  >
                    {l.native}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.loginBtn,
              {
                backgroundColor: otpFilled ? colors.primary : colors.border,
              },
            ]}
            onPress={verify}
            disabled={!otpFilled}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>{s.loginBtn}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendRow}
            onPress={handleResend}
            disabled={!canResend}
            activeOpacity={canResend ? 0.7 : 1}
          >
            <Text
              style={[
                styles.resendText,
                { color: canResend ? colors.primary : colors.mutedForeground },
              ]}
            >
              {canResend ? s.resend : s.resendCountdown(countdownDisplay)}
            </Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.registerRow}>
            <Text style={[styles.registerLabel, { color: colors.mutedForeground }]}>
              {s.registerLabel}{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              activeOpacity={0.7}
            >
              <Text style={[styles.registerLink, { color: colors.primary }]}>
                {s.registerLink}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {Platform.OS === "web" && (
          <View nativeID="recaptcha-container" style={{ width: 0, height: 0 }} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 4,
  },
  headerWelcome: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "500",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginTop: 2,
  },
  headerSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  body: {
    padding: 20,
    gap: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  mobileRow: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderRadius: 10,
    overflow: "hidden",
    height: 52,
  },
  prefixBox: {
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRightWidth: 1.5,
  },
  prefixText: {
    fontSize: 16,
    fontWeight: "700",
  },
  mobileInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 18,
    fontWeight: "600",
  },
  otpContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
  },
  otpRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  otpBox: {
    borderWidth: 2,
    borderRadius: 10,
    fontSize: 20,
    fontWeight: "800",
  },
  otpSentText: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  langContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
  },
  langRow: {
    flexDirection: "row",
    gap: 8,
  },
  langPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: "center",
  },
  langText: {
    fontSize: 14,
    fontWeight: "700",
  },
  loginBtn: {
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: "center",
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  resendRow: {
    alignItems: "center",
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
  },
  registerLabel: {
    fontSize: 13,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: "700",
  },
});
