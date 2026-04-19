import React, { Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";
const AlertsScreen = React.lazy(() => import("@/screens/AlertsScreen"));
export default function Alerts() {
  return <Suspense fallback={<LoadingFallback />}><AlertsScreen /></Suspense>;
}
