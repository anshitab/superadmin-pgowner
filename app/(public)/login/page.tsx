"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "motion/react";

const ownerAppUrl = process.env.NEXT_PUBLIC_OWNER_APP_URL || "http://localhost:3000";

export default function AdminLoginPage() {
  const { signIn, signOut, loading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated && user?.role === "super_admin") {
      router.replace("/");
    }
  }, [loading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setSubmitting(true);
    try {
      const result = await signIn(email.trim(), password);
      if (result.error) {
        const msg = result.error.toLowerCase();
        setError(
          msg.includes("invalid") || msg.includes("credentials")
            ? "Incorrect email or password"
            : result.error
        );
        return;
      }

      if (result.role !== "super_admin") {
        await signOut();
        setError("This account is not authorized for Super Admin access.");
        return;
      }

      router.replace("/");
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--muted)]/70 focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/15";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--teal)] border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div
      className="grid min-h-screen lg:grid-cols-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55 }}
        className="relative hidden bg-[var(--ink)] lg:flex"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(31,111,97,0.35),transparent_55%)]" />
        <div className="relative flex h-full w-full flex-col justify-between p-12">
          <p className="font-display text-2xl font-semibold text-white">ProManage</p>
          <div className="max-w-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-white/10">
              <Shield size={22} className="text-[var(--mist)]" />
            </div>
            <p className="font-display text-3xl font-semibold leading-snug text-white">
              Platform oversight.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Property verification, owners, and system controls—restricted access.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="flex items-center justify-center bg-[var(--surface)] px-5 py-10 sm:px-8 lg:p-12"
      >
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--forest)]">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-[var(--ink)]">ProManage</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--teal)]">
                Super Admin
              </p>
            </div>
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--ink)]">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Authorized super admin credentials only.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                autoComplete="username"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)]"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-[var(--ink)] py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest)] disabled:opacity-50"
            >
              {submitting ? "Signing in..." : "Sign in to Admin"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            Owner or tenant?{" "}
            <a
              href={`${ownerAppUrl}/login?role=owner`}
              className="font-medium text-[var(--teal)] hover:text-[var(--teal-deep)]"
            >
              Go to main login
            </a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
