'use client';
import { useState } from 'react';

type Prescription = {
  id: string;
  action: string;
  cost: number;
  timeSaved: number;
  speedLabel: string;
};

const PRESCRIPTIONS: Prescription[] = [
  { id: "A", action: "Air Freight", cost: 15000, timeSaved: 14, speedLabel: "Fastest" },
  { id: "B", action: "Secondary Supplier (10% premium)", cost: 5000, timeSaved: 10, speedLabel: "Moderate" },
  { id: "C", action: "Delay Final Product Launch", cost: 0, timeSaved: 0, speedLabel: "Slowest" },
];

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
    } catch (err) {
      setError("Could not reach backend. Make sure uvicorn is running on port 8000.");
    } finally {
      setExecuting(null);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
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
          <div key={p.id} className="border rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-500">OPTION {p.id}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {p.speedLabel}
                </span>
              </div>
              <h3 className="font-medium mb-2">{p.action}</h3>
              <p className="text-sm text-gray-600">Cost: ${p.cost.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Time saved: {p.timeSaved} days</p>
            </div>
            <button
              onClick={() => executeDecision(p)}
              disabled={executing !== null}
              className="mt-4 bg-black text-white text-sm rounded py-2 hover:opacity-90 disabled:opacity-50"
            >
              {executing === p.id ? "Executing..." : "Execute Decision"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}