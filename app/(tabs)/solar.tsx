import React, { Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";
const SolarScreen = React.lazy(() => import("@/screens/SolarScreen"));
export default function Solar() {
  return <Suspense fallback={<LoadingFallback />}><SolarScreen /></Suspense>;
}
