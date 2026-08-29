type Prescription = {
  id: string;
  action: string;
  cost: number;
  timeSaved: number;
  speedLabel: string;
  feasible: boolean;
};

const PRESCRIPTIONS: Prescription[] = [
  { id: "A", action: "Air Freight", cost: 15000, timeSaved: 14, speedLabel: "Fastest", feasible: true },
  { id: "B", action: "Secondary Supplier (10% premium)", cost: 5000, timeSaved: 10, speedLabel: "Moderate", feasible: true },
  { id: "C", action: "Delay Final Product Launch", cost: 0, timeSaved: 0, speedLabel: "Slowest", feasible: true },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">SupplyPrescript</h1>
      <p className="text-gray-600 mb-8">Closed-Loop Prescriptive Analytics</p>

      <div className="border rounded p-4 mb-8 bg-yellow-50 border-yellow-200">
        <p className="text-sm font-medium text-yellow-800">
          ⚠ Predicted delay: 14 days for microchip shipment (Supplier A, Asia route)
        </p>
      </div>

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
            <button className="mt-4 bg-black text-white text-sm rounded py-2 hover:opacity-90">
              Execute Decision
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}