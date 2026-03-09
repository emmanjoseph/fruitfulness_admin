// components/auth-guard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // 👇 Don't redirect until store has loaded from localStorage
    if (!_hasHydrated) return;

    if (!isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  // 👇 Show nothing (or a loader) until hydration is complete
  if (!_hasHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}