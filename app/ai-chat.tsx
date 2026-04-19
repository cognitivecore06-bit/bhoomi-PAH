import React, { Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";
const AIChatScreen = React.lazy(() => import("@/screens/AIChatScreen"));
export default function AIChat() {
  return <Suspense fallback={<LoadingFallback />}><AIChatScreen /></Suspense>;
}
