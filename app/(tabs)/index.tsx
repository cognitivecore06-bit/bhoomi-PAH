import React, { Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";
const HomeScreen = React.lazy(() => import("@/screens/HomeScreen"));
export default function Home() {
  return <Suspense fallback={<LoadingFallback />}><HomeScreen /></Suspense>;
}
