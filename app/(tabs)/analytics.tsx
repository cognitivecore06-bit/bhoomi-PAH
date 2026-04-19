import React, { Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";
const AnalyticsScreen = React.lazy(() => import("@/screens/AnalyticsScreen"));
export default function Analytics() {
  return <Suspense fallback={<LoadingFallback />}><AnalyticsScreen /></Suspense>;
}
