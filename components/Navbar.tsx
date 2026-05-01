'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, ArrowRightLeft, BookOpen, House, LayoutDashboard, Map, Network, ShieldPlus } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: House },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scenario', label: 'Scenario', icon: ShieldPlus },
  { href: '/results', label: 'Results', icon: ArrowRightLeft },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/algorithms', label: 'Algorithms', icon: BookOpen },
  { href: '/code-structure', label: 'Code Flow', icon: Network },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 mb-6 pt-5">
      <nav className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-4 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-2xl border border-transparent px-2 py-2 transition hover:border-white/10 hover:bg-white/5"
          >
            <div className="rounded-2xl bg-gradient-to-br from-sky-400/30 via-brand-500/20 to-emerald-400/20 p-3 text-sky-200 ring-1 ring-white/10">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-2xl font-semibold tracking-wide text-white">CrisisRoute</span>
          </Link>

          <div className="flex flex-wrap gap-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? 'border-sky-400/30 bg-sky-400/15 text-white shadow-[0_0_0_1px_rgba(56,189,248,0.08)]'
                      : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
