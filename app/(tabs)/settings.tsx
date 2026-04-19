import React, { Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";
const SettingsScreen = React.lazy(() => import("@/screens/SettingsScreen"));
export default function Settings() {
  return <Suspense fallback={<LoadingFallback />}><SettingsScreen /></Suspense>;
}
