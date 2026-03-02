"use client";

import { useEffect } from "react";
import { initPulse } from "@velocity/pulse";

export default function AnalyticsProvider() {
  useEffect(() => {
    initPulse();
  }, []);
  return null;
}
