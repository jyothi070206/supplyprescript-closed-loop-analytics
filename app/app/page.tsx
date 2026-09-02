'use client';
import { useState, useEffect } from 'react';

type Prescription = {
  id: string;
  action: string;
  cost: number;
  timeSaved: number;
  speedLabel: string;
  costPerDaySaved: number | null;
};

const PRESCRIPTIONS: Prescription[] = [
  { id: "A", action: "Air Freight", cost: 15000, timeSaved: 14, speedLabel: "Fastest", costPerDaySaved: 1071.43 },
  { id: "B", action: "Secondary Supplier (10% premium)", cost: 5000, timeSaved: 10, speedLabel: "Moderate", costPerDaySaved: 500 },
  { id: "C", action: "Delay Final Product Launch", cost: 0, timeSaved: 0, speedLabel: "Slowest", costPerDaySaved: null },
];

const bestValueId = PRESCRIPTIONS
  .filter((p) => p.costPerDaySaved !== null)
  .sort((a, b) => (a.costPerDaySaved! - b.costPerDaySaved!))[0]?.id;

const PIPELINE = ["Predicted", "Prescribed", "Executed", "Evaluated"];

const API_URL = "http://127.0.0.1:8000";

type EvaluatedDecision = {
  decision_id: number;
  action: string;
  predicted_cost: number;
  actual_cost: number;
  discrepancy: number;
  accurate_within_10pct: boolean;
};

function PipelineStepper({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex items-center">
      {PIPELINE.map((stage, i) => (
        <div key={stage} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs font-medium ${
                i <= activeStep
                  ? "bg-[var(--amber)] text-white"
                  : "bg-white border border-[var(--line)] text-[var(--ink-soft)]"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs font-medium ${
                i <= activeStep ? "text-[var(--ink)]" : "text-[var(--ink-soft)]"
              }`}
            >
              {stage}
            </span>
          </div>
          {i < PIPELINE.length - 1 && (
            <div
              className={`h-px flex-1 mx-2 mb-5 ${
                i < activeStep ? "bg-[var(--amber)]" : "bg-[var(--line)]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [executing, setExecuting] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1); // Predicted + Prescribed shown by default
  const [evaluated, setEvaluated] = useState<EvaluatedDecision[]>([]);
  const [loadingLedger, setLoadingLedger] = useState(true);

  const loadLedger = async () => {
    setLoadingLedger(true);
    try {
      const res = await fetch(`${API_URL}/closed-loop-summary`);
      const data = await res.json();
      setEvaluated(data.evaluated_decisions || []);
    } catch {
      setEvaluated([]);
    } finally {
      setLoadingLedger(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, []);

  const executeDecision = async (p: Prescription) => {
    setExecuting(p.id);
    setConfirmation(null);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/execute-decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipment_id: 1,
          predicted_delay_days: 14,
          chosen_option: p.id,
          chosen_action: p.action,
          cost_usd: p.cost,
          time_saved_days: p.timeSaved,
        }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setConfirmation(`Decision #${data.decision_id} recorded at ${data.executed_at}`);
      setActiveStep(2); // Executed
      loadLedger();
    } catch {
      setError("Could not reach the backend. Start uvicorn on port 8000 and try again.");
    } finally {
      setExecuting(null);
    }
  };

  const accurateCount = evaluated.filter((e) => e.accurate_within_10pct).length;
  const accuracyRate = evaluated.length > 0 ? Math.round((accurateCount / evaluated.length) * 100) : null;

  return (
    <div className="min-h-screen">
      {/* Status strip */}
      <div className="bg-[var(--ink)] px-6 py-1.5 sm:px-10">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">
            Operations Control
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--amber)]">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--amber)]" />
            Monitoring Shipment #1
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-[var(--surface)] border-b border-[var(--line)] px-6 py-5 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-soft)]">
            Closed-Loop Prescriptive Analytics
          </p>
          <h1 className="font-display text-3xl font-semibold text-[var(--ink)] mt-1">
            SupplyPrescript
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10 space-y-6">
        {/* Pipeline */}
        <section className="rise-in card-shadow bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6">
          <PipelineStepper activeStep={activeStep} />
        </section>

        {/* Delay alert */}
        <div className="rise-in bg-[var(--amber-soft)] border border-[var(--amber)]/30 rounded-xl p-4">
          <p className="text-sm font-medium text-[#8a4319]">
            Predicted delay: 14 days — microchip shipment, Supplier A, Asia route
          </p>
        </div>

        {confirmation && (
          <div className="rise-in bg-[var(--success-soft)] border border-[var(--success)]/30 rounded-xl p-4">
            <p className="text-sm font-medium text-[var(--success)]">{confirmation}</p>
          </div>
        )}
        {error && (
          <div className="rise-in bg-[var(--danger-soft)] border border-[var(--danger)]/30 rounded-xl p-4">
            <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
          </div>
        )}

        {/* Prescriptions */}
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--ink)] mb-3">
            Recommended actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {PRESCRIPTIONS.map((p) => (
              <div
                key={p.id}
                className={`rise-in card-shadow bg-[var(--surface)] rounded-2xl p-5 flex flex-col justify-between ${
                  p.id === bestValueId ? "border-2 border-[var(--amber)]" : "border border-[var(--line)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-[var(--ink-soft)]">OPTION {p.id}</span>
                    <div className="flex gap-1.5">
                      {p.id === bestValueId && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--amber)] text-white">
                          Best value
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--steel-soft)] text-[var(--steel)]">
                        {p.speedLabel}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-medium text-[var(--ink)] mb-3">{p.action}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-[var(--ink-soft)]">
                      Cost <span className="font-mono text-[var(--ink)]">${p.cost.toLocaleString()}</span>
                    </p>
                    <p className="text-[var(--ink-soft)]">
                      Time saved <span className="font-mono text-[var(--ink)]">{p.timeSaved}d</span>
                    </p>
                    {p.costPerDaySaved !== null && (
                      <p className="font-mono text-xs text-[var(--ink-soft)]">
                        ${p.costPerDaySaved.toLocaleString()}/day saved
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => executeDecision(p)}
                  disabled={executing !== null}
                  className="mt-4 bg-[var(--ink)] text-white text-sm rounded-lg py-2.5 hover:bg-[var(--steel)] transition disabled:opacity-50"
                >
                  {executing === p.id ? "Executing…" : "Execute decision"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Decision ROI / Closed-Loop Ledger */}
        <section className="rise-in card-shadow bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-soft)]">
                Feedback loop
              </p>
              <h2 className="font-display text-lg font-semibold text-[var(--ink)]">
                Decision ROI
              </h2>
            </div>
            {accuracyRate !== null && (
              <div className="text-right">
                <p className="font-mono text-2xl font-semibold text-[var(--ink)]">{accuracyRate}%</p>
                <p className="text-xs text-[var(--ink-soft)]">accurate within 10%</p>
              </div>
            )}
          </div>

          {loadingLedger ? (
            <p className="text-sm text-[var(--ink-soft)]">Loading evaluated decisions…</p>
          ) : evaluated.length === 0 ? (
            <p className="text-sm text-[var(--ink-soft)]">
              No outcomes recorded yet. Once a decisions real-world cost is known, it appears here compared against the original prediction.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--ink-soft)] border-b border-[var(--line)]">
                    <th className="py-2 pr-4 font-normal">Action</th>
                    <th className="py-2 pr-4 font-normal">Predicted</th>
                    <th className="py-2 pr-4 font-normal">Actual</th>
                    <th className="py-2 pr-4 font-normal">Discrepancy</th>
                    <th className="py-2 font-normal">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluated.map((e) => (
                    <tr key={e.decision_id} className="border-b border-[var(--line)] last:border-0">
                      <td className="py-2.5 pr-4 text-[var(--ink)]">{e.action}</td>
                      <td className="py-2.5 pr-4 font-mono text-[var(--ink)]">${e.predicted_cost.toLocaleString()}</td>
                      <td className="py-2.5 pr-4 font-mono text-[var(--ink)]">${e.actual_cost.toLocaleString()}</td>
                      <td className="py-2.5 pr-4 font-mono text-[var(--ink)]">
                        {e.discrepancy >= 0 ? "+" : ""}${e.discrepancy.toLocaleString()}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            e.accurate_within_10pct
                              ? "bg-[var(--success-soft)] text-[var(--success)]"
                              : "bg-[var(--danger-soft)] text-[var(--danger)]"
                          }`}
                        >
                          {e.accurate_within_10pct ? "On target" : "Off target"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}