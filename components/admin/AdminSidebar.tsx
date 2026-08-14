"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  UserCog,
  Shield,
  X,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Owners", href: "/owners", icon: UserCog },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const content = (
    <>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <Link href="/" className="flex items-center gap-2.5" onClick={onMobileClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--teal)]">
            <Shield size={15} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold leading-none tracking-tight text-white">
              ProManage
            </h1>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--mist)]">
              Super Admin
            </p>
          </div>
        </Link>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="p-1.5 text-[var(--sidebar-text)] hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <p className="mb-2 px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
          Platform
        </p>
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onMobileClose}
                  className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/10 text-[var(--sidebar-active)]"
                      : "text-[var(--sidebar-text)] hover:bg-white/5 hover:text-white/90"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 h-5 w-[3px] rounded-r-full bg-[var(--teal)]" />
                  )}
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  return (
    <>
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] md:flex">
        {content}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className="relative flex h-full w-72 max-w-[80vw] flex-col bg-[var(--sidebar-bg)] text-[var(--sidebar-text)]">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
