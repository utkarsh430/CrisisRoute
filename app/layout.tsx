import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CrisisRoute',
  description: 'Humanitarian crisis response optimization for aid allocation and safe route planning.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_24%),radial-gradient(circle_at_bottom,rgba(249,115,22,0.08),transparent_30%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-10 sm:px-6 lg:px-8">
            <Navbar />

            <section className="mb-8 rounded-[2rem] border border-white/10 bg-slate-950/45 px-6 py-6 shadow-soft backdrop-blur-sm sm:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl space-y-3">
                  <p className="text-sm font-medium uppercase tracking-[0.35em] text-sky-300">Humanitarian operations studio</p>
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">CrisisRoute</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                      Plan scarce aid distribution and evaluate safer delivery routes across conflict, displacement, and medical
                      emergency scenarios using transparent local-first optimization models.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[20rem]">
                  <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-sky-200">Project focus</p>
                    <p className="mt-2 text-sm text-white">Allocation priority, route safety, and scenario comparison</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Capstone style</p>
                    <p className="mt-2 text-sm text-white">Polished analytics interface for clear operational decisions</p>
                  </div>
                </div>
              </div>
            </section>

            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
