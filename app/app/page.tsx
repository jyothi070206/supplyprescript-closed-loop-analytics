'use client';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const optionData = [
  { name: 'Air Freight', cost: 15000, timeSaved: 14 },
  { name: 'Secondary Supplier', cost: 5000, timeSaved: 10 },
  { name: 'Delay Launch', cost: 0, timeSaved: 0 },
];

const STEPS = [
  { n: '01', title: 'Predict', text: 'An XGBoost model flags shipments likely to run late, based on supplier, distance, and seasonality.' },
  { n: '02', title: 'Prescribe', text: 'A budget-audited optimizer proposes 3 alternative actions, each with real cost and time trade-offs.' },
  { n: '03', title: 'Execute', text: 'An operator picks one — the decision is written permanently into a live database.' },
  { n: '04', title: 'Evaluate', text: 'Once the real outcome is known, it\u2019s compared against the prediction, and the model learns from the gap.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="bg-[var(--ink)] px-6 py-1.5 sm:px-10">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">
            Operations Control
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--amber)]">
            Closed-Loop Prescriptive Analytics
          </span>
        </div>
      </div>

      <header className="bg-[var(--surface)] border-b border-[var(--line)] px-6 py-5 sm:px-10">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--ink)]">
            SupplyPrescript
          </h1>
          <Link
            href="/dashboard"
            className="bg-[var(--ink)] text-white text-sm rounded-lg px-5 py-2.5 hover:bg-[var(--steel)] transition"
          >
            Open Dashboard →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-10 sm:py-14">
        {/* Hero */}
        <section className="rise-in">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--ink)] max-w-2xl leading-tight">
            Predicts the delay. Prescribes the fix. Learns from the outcome.
          </h2>
          <p className="mt-4 max-w-xl text-[var(--ink-soft)]">
            Predictive analytics tell you a shipment will be late. SupplyPrescript
            goes further — it recommends cost-audited alternatives, tracks what
            you decide, and checks its own advice against reality.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block bg-[var(--amber)] text-white text-sm font-medium rounded-lg px-6 py-3 hover:opacity-90 transition"
          >
            See it in action →
          </Link>
        </section>

        {/* How it works */}
        <section className="mt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-soft)] mb-4">
            How it works
          </p>
          <div className="grid gap-4 sm:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rise-in card-shadow bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5">
                <p className="font-mono text-xs text-[var(--amber)] mb-1">{s.n}</p>
                <p className="font-display font-semibold text-[var(--ink)] mb-1.5">{s.title}</p>
                <p className="text-xs text-[var(--ink-soft)] leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Preview chart */}
        <section className="mt-16 rise-in card-shadow bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-soft)] mb-1">
            Sample scenario
          </p>
          <h3 className="font-display text-lg font-semibold text-[var(--ink)] mb-4">
            Cost vs. time saved across 3 prescribed options
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={optionData}>
              <CartesianGrid strokeDasharray="3 6" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--ink-soft)' }} axisLine={{ stroke: 'var(--line)' }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--ink-soft)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: 12, borderColor: 'var(--line)', borderRadius: 8 }} />
              <Bar dataKey="cost" name="Cost ($)" fill="var(--amber)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="timeSaved" name="Time saved (days)" fill="var(--steel)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] px-6 py-6 text-center sm:px-10">
        <p className="text-xs text-[var(--ink-soft)]">
          Built with Next.js, FastAPI, XGBoost, SciPy, and PostgreSQL.
        </p>
      </footer>
    </div>
  );
}