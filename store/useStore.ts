import { create } from "zustand";

export type ValveStatus = "on" | "off";
export type ZoneStatus = "good" | "warning" | "critical";

export interface Zone {
  id: string;
  name: string;
  cropMr: string;
  cropEn: string;
  moisture: number;
  valveStatus: ValveStatus;
  status: ZoneStatus;
  waterNeeded: number;
  waterGiven: number;
  npk: { n: number; p: number; k: number; ph: number };
  npkStatus: { n: string; p: string; k: string };
  growthStage: string;
  growthStageMr: string;
  daysToHarvest: number;
  health: number;
  yieldForecast: string;
  color: string;
  bgColor: string;
}

export interface Alert {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  titleMr: string;
  titleEn: string;
  descMr: string;
  descEn: string;
  time: string;
  read: boolean;
  category: "irrigation" | "fertilizer" | "fault" | "weather";
}

export interface WeatherDay {
  dayMr: string;
  dayEn: string;
  tempC: number;
  conditionMr: string;
  conditionEn: string;
  icon: string;
  skipIrrigation: boolean;
}

export interface FertilizerPlan {
  zone: string;
  nameMr: string;
  nameEn: string;
  quantity: string;
  urgency: "high" | "medium" | "low";
}

export type Language = "mr" | "hi" | "en";
export type IrrigationMode = "auto" | "manual";

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;

  zones: Zone[];
  toggleValve: (zoneId: string) => void;

  irrigationMode: IrrigationMode;
  setIrrigationMode: (mode: IrrigationMode) => void;

  alerts: Alert[];
  markAlertRead: (id: string) => void;
  markAllRead: () => void;

  notifications: {
    irrigation: boolean;
    fertilizer: boolean;
    fault: boolean;
    weather: boolean;
  };
  toggleNotification: (key: keyof AppState["notifications"]) => void;
}

const ZONES: Zone[] = [
  {
    id: "A",
    name: "Zone A",
    cropMr: "गहू",
    cropEn: "Wheat",
    moisture: 68,
    valveStatus: "on",
    status: "good",
    waterNeeded: 320,
    waterGiven: 320,
    npk: { n: 18, p: 42, k: 38, ph: 6.8 },
    npkStatus: { n: "low", p: "good", k: "good" },
    growthStage: "Tillering",
    growthStageMr: "फुटवे अवस्था",
    daysToHarvest: 62,
    health: 87,
    yieldForecast: "4.2 ton/acre",
    color: "#2E7D32",
    bgColor: "#E8F5E9",
  },
  {
    id: "B",
    name: "Zone B",
    cropMr: "उस",
    cropEn: "Sugarcane",
    moisture: 28,
    valveStatus: "off",
    status: "warning",
    waterNeeded: 450,
    waterGiven: 0,
    npk: { n: 35, p: 68, k: 44, ph: 7.2 },
    npkStatus: { n: "good", p: "high", k: "good" },
    growthStage: "Grand Growth",
    growthStageMr: "महा वाढ अवस्था",
    daysToHarvest: 180,
    health: 72,
    yieldForecast: "35 ton/acre",
    color: "#FF8F00",
    bgColor: "#FFF8E1",
  },
  {
    id: "C",
    name: "Zone C",
    cropMr: "कांदा",
    cropEn: "Onion",
    moisture: 55,
    valveStatus: "on",
    status: "good",
    waterNeeded: 280,
    waterGiven: 190,
    npk: { n: 28, p: 36, k: 22, ph: 6.5 },
    npkStatus: { n: "good", p: "good", k: "low" },
    growthStage: "Bulb Formation",
    growthStageMr: "कंद तयार होणे",
    daysToHarvest: 45,
    health: 91,
    yieldForecast: "12 ton/acre",
    color: "#2E7D32",
    bgColor: "#E8F5E9",
  },
  {
    id: "D",
    name: "Zone D",
    cropMr: "टोमॅटो",
    cropEn: "Tomato",
    moisture: 19,
    valveStatus: "off",
    status: "critical",
    waterNeeded: 390,
    waterGiven: 30,
    npk: { n: 12, p: 20, k: 18, ph: 6.2 },
    npkStatus: { n: "low", p: "low", k: "low" },
    growthStage: "Flowering",
    growthStageMr: "फुलोरा अवस्था",
    daysToHarvest: 38,
    health: 58,
    yieldForecast: "8 ton/acre",
    color: "#C62828",
    bgColor: "#FFEBEE",
  },
];

const ALERTS: Alert[] = [
  {
    id: "1",
    type: "critical",
    titleMr: "Zone D - आर्द्रता अत्यंत कमी",
    titleEn: "Zone D - Critical moisture",
    descMr: "टोमॅटो झोनची आर्द्रता 19% - ताबडतोब पाणी द्या",
    descEn: "Tomato zone moisture 19% - irrigate immediately",
    time: "आत्ता",
    read: false,
    category: "irrigation",
  },
  {
    id: "2",
    type: "warning",
    titleMr: "Zone A - खत आवश्यक",
    titleEn: "Zone A - Fertilizer needed",
    descMr: "गहू झोनमध्ये नत्र (N) कमी आहे",
    descEn: "Nitrogen (N) is low in wheat zone",
    time: "९:२८ सकाळी",
    read: false,
    category: "fertilizer",
  },
  {
    id: "3",
    type: "info",
    titleMr: "गुरुवारी पाऊस येण्याची शक्यता",
    titleEn: "Rain forecast Thursday",
    descMr: "गुरुवारी सिंचन आपोआप बंद होईल",
    descEn: "Irrigation will be skipped on Thursday",
    time: "९:०० सकाळी",
    read: true,
    category: "weather",
  },
  {
    id: "4",
    type: "success",
    titleMr: "Zone A - सिंचन पूर्ण",
    titleEn: "Zone A irrigation complete",
    descMr: "३२० लिटर पाणी दिले गेले",
    descEn: "320 liters delivered successfully",
    time: "८:५५ सकाळी",
    read: true,
    category: "irrigation",
  },
];

export const useStore = create<AppState>((set) => ({
  language: "mr",
  setLanguage: (lang) => set({ language: lang }),

  zones: ZONES,
  toggleValve: (zoneId) =>
    set((state) => ({
      zones: state.zones.map((z) =>
        z.id === zoneId
          ? { ...z, valveStatus: z.valveStatus === "on" ? "off" : "on" }
          : z
      ),
    })),

  irrigationMode: "auto",
  setIrrigationMode: (mode) => set({ irrigationMode: mode }),

  alerts: ALERTS,
  markAlertRead: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, read: true } : a
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      alerts: state.alerts.map((a) => ({ ...a, read: true })),
    })),

  notifications: {
    irrigation: true,
    fertilizer: true,
    fault: true,
    weather: true,
  },
  toggleNotification: (key) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [key]: !state.notifications[key],
      },
    })),
}));

export const WEATHER: WeatherDay[] = [
  { dayMr: "आज", dayEn: "Today", tempC: 29, conditionMr: "ऊन", conditionEn: "Sunny", icon: "sun", skipIrrigation: false },
  { dayMr: "उद्या", dayEn: "Tomorrow", tempC: 31, conditionMr: "ऊन", conditionEn: "Sunny", icon: "sun", skipIrrigation: false },
  { dayMr: "बुधवार", dayEn: "Wednesday", tempC: 28, conditionMr: "ढगाळ", conditionEn: "Cloudy", icon: "cloud", skipIrrigation: false },
  { dayMr: "गुरुवार", dayEn: "Thursday", tempC: 24, conditionMr: "पाऊस", conditionEn: "Rain", icon: "cloud-rain", skipIrrigation: true },
  { dayMr: "शुक्रवार", dayEn: "Friday", tempC: 27, conditionMr: "अंशतः ढग", conditionEn: "Partly Cloudy", icon: "cloud", skipIrrigation: false },
];

export const FERTILIZER_PLANS: FertilizerPlan[] = [
  { zone: "A", nameMr: "युरिया", nameEn: "Urea", quantity: "5 kg", urgency: "high" },
  { zone: "A", nameMr: "DAP", nameEn: "DAP", quantity: "3 kg", urgency: "medium" },
  { zone: "B", nameMr: "पोटॅश", nameEn: "Potash", quantity: "4 kg", urgency: "low" },
  { zone: "C", nameMr: "युरिया", nameEn: "Urea", quantity: "3 kg", urgency: "medium" },
  { zone: "D", nameMr: "युरिया", nameEn: "Urea", quantity: "6 kg", urgency: "high" },
  { zone: "D", nameMr: "पोटॅश", nameEn: "Potash", quantity: "4 kg", urgency: "high" },
  { zone: "D", nameMr: "DAP", nameEn: "DAP", quantity: "5 kg", urgency: "high" },
];

export const SOLAR_DATA = {
  panelCapacity: 2.4,
  generating: 2.1,
  battery: 78,
  estFullCharge: "2:30 PM",
  todayGenerated: 14.2,
  usage: 1.8,
  chartData: [
    { hour: "6AM", kw: 0.2 },
    { hour: "8AM", kw: 0.8 },
    { hour: "10AM", kw: 1.6 },
    { hour: "12PM", kw: 2.1 },
    { hour: "2PM", kw: 1.9 },
    { hour: "4PM", kw: 1.2 },
    { hour: "6PM", kw: 0.3 },
  ],
};

export const WATER_ANALYTICS = {
  todayL: 1240,
  savedPercent: 24,
  weekTotal: 8540,
  savedToday: 390,
  weekData: [
    { day: "सोम", dayEn: "Mon", liters: 1100 },
    { day: "मंगळ", dayEn: "Tue", liters: 1280 },
    { day: "बुध", dayEn: "Wed", liters: 980 },
    { day: "गुरु", dayEn: "Thu", liters: 0 },
    { day: "शुक्र", dayEn: "Fri", liters: 1420 },
    { day: "शनि", dayEn: "Sat", liters: 1520 },
    { day: "आज", dayEn: "Today", liters: 1240 },
  ],
  aiPrediction: [1150, 1300, 0, 1200, 1400, 1350, 1100],
};

export const FARMER = {
  nameMr: "रमेश शिंदे",
  nameEn: "Ramesh Shinde",
  villageMr: "वडाळे, पुणे",
  villageEn: "Vadale, Pune",
  farmArea: "4 एकर",
  farmAreaEn: "4 Acre",
};
