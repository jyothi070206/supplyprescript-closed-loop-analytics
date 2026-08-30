'use client';
import { useState } from 'react';

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

// Best value = lowest cost per day saved (excluding the zero-benefit option)
const bestValueId = PRESCRIPTIONS
  .filter((p) => p.costPerDaySaved !== null)
  .sort((a, b) => (a.costPerDaySaved! - b.costPerDaySaved!))[0]?.id;

const API_URL = "http://127.0.0.1:8000";

export default function DashboardPage() {
  const [executing, setExecuting] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    } catch {
      setError("Could not reach backend. Make sure uvicorn is running on port 8000.");
    } finally {
      setExecuting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">SupplyPrescript</h1>
        <p className="text-gray-600 mb-8">Closed-Loop Prescriptive Analytics</p>

        <div className="border rounded p-4 mb-6 bg-yellow-50 border-yellow-200">
          <p className="text-sm font-medium text-yellow-800">
            ⚠ Predicted delay: 14 days for microchip shipment (Supplier A, Asia route)
          </p>
        </div>

        {confirmation && (
          <div className="border rounded p-4 mb-6 bg-green-50 border-green-200">
            <p className="text-sm font-medium text-green-800">✓ {confirmation}</p>
          </div>
        )}
        {error && (
          <div className="border rounded p-4 mb-6 bg-red-50 border-red-200">
            <p className="text-sm font-medium text-red-800">✗ {error}</p>
          </div>
        )}

        <h2 className="text-lg font-semibold mb-3">Recommended Actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PRESCRIPTIONS.map((p) => (
            <div
              key={p.id}
              className={`bg-white border rounded-lg p-5 flex flex-col justify-between shadow-sm ${
                p.id === bestValueId ? "border-black ring-1 ring-black" : "border-gray-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-gray-500">OPTION {p.id}</span>
                  <div className="flex gap-1">
                    {p.id === bestValueId && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-black text-white">
                        Best Value
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {p.speedLabel}
                    </span>
                  </div>
                </div>
                <h3 className="font-medium mb-3">{p.action}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Cost: <span className="font-medium text-gray-900">${p.cost.toLocaleString()}</span></p>
                  <p>Time saved: <span className="font-medium text-gray-900">{p.timeSaved} days</span></p>
                  {p.costPerDaySaved !== null && (
                    <p className="text-xs text-gray-400">
                      ${p.costPerDaySaved.toLocaleString()} per day saved
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => executeDecision(p)}
                disabled={executing !== null}
                className="mt-4 bg-black text-white text-sm rounded py-2 hover:opacity-90 disabled:opacity-50 transition"
              >
                {executing === p.id ? "Executing..." : "Execute Decision"}
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-6">
         Best Value = lowest cost per day of delay avoided, subject to the hard budget constraint (verified in Optimization Audit).
        </p>
      </div>
    </div>
  );
}