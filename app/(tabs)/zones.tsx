import React, { Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";
const ZonesScreen = React.lazy(() => import("@/screens/ZonesScreen"));
export default function Zones() {
  return <Suspense fallback={<LoadingFallback />}><ZonesScreen /></Suspense>;
}
