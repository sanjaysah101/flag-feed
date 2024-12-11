"use client";

import { useEffect, useState } from "react";

export const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // During SSR and initial client render, return null
  if (!hasMounted) {
    return null;
  }

  // After hydration/mounting, render children
  return <>{children}</>;
};
