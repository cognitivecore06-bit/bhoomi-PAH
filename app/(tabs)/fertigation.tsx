import React, { Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";
const FertigationScreen = React.lazy(() => import("@/screens/FertigationScreen"));
export default function Fertigation() {
  return <Suspense fallback={<LoadingFallback />}><FertigationScreen /></Suspense>;
}
