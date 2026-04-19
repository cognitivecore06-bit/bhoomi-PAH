import React, { Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";
const IrrigationScreen = React.lazy(() => import("@/screens/IrrigationScreen"));
export default function Irrigation() {
  return <Suspense fallback={<LoadingFallback />}><IrrigationScreen /></Suspense>;
}
