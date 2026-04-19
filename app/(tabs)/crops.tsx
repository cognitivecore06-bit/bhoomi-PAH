import React, { Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";
const CropsScreen = React.lazy(() => import("@/screens/CropsScreen"));
export default function Crops() {
  return <Suspense fallback={<LoadingFallback />}><CropsScreen /></Suspense>;
}
