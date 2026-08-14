"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" richColors closeButton toastOptions={{ duration: 3500 }} />
    </AuthProvider>
  );
}
