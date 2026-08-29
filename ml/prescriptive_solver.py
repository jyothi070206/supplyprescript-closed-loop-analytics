"""
Prescriptive Solver — generates the 3 best alternative actions
when a shipment delay is predicted, matching the use case from
the project brief: Air Freight, Secondary Supplier, Delay Launch.

Uses simple constrained scoring (a lightweight linear-optimization
approach) rather than a full LP solver, since each option here is
a discrete choice, not a continuous allocation problem — but the
scoring itself is built from the same cost/time trade-off logic
SciPy's linprog would optimize.
"""

from scipy.optimize import linprog
import numpy as np


def generate_prescriptions(predicted_delay_days: int, order_value_usd: float,
                            max_budget: float = 20000):
    """
    Given a predicted delay, generate 3 alternative actions with
    their cost, time, and a feasibility flag based on hard constraints.
    """

    options = [
        {
            "id": "A",
            "action": "Air Freight",
            "cost_usd": round(order_value_usd * 0.30, 2),   # ~30% premium
            "time_saved_days": predicted_delay_days,          # fully resolves delay
            "speed_label": "Fastest",
        },
        {
            "id": "B",
            "action": "Secondary Supplier (10% premium)",
            "cost_usd": round(order_value_usd * 0.10, 2),
            "time_saved_days": max(predicted_delay_days - 4, 0),  # partial improvement
            "speed_label": "Moderate",
        },
        {
            "id": "C",
            "action": "Delay Final Product Launch",
            "cost_usd": 0.0,
            "time_saved_days": 0,
            "speed_label": "Slowest",
        },
    ]

    # --- Hard budget constraint (Cost Governance-style rule) ---
    for opt in options:
        opt["feasible"] = opt["cost_usd"] <= max_budget

    # --- Score each option: minimize cost, maximize time saved ---
    # This mirrors what a linprog objective function would optimize:
    # minimize cost per day of delay avoided.
    for opt in options:
        if opt["time_saved_days"] > 0:
            opt["cost_per_day_saved"] = round(opt["cost_usd"] / opt["time_saved_days"], 2)
        else:
            opt["cost_per_day_saved"] = None  # no benefit, can't divide by zero

    return options


def prove_constraint_never_violated(options, max_budget):
    """
    Optimization Audit helper: proves no returned option
    ever exceeds the hard budget constraint.
    """
    violations = [o for o in options if o["cost_usd"] > max_budget]
    return len(violations) == 0


if __name__ == "__main__":
    predicted_delay = 14  # matches the brief's example: 14-day delay
    order_value = 50000   # e.g. microchip order value
    budget_cap = 20000

    prescriptions = generate_prescriptions(predicted_delay, order_value, budget_cap)

    print(f"Predicted delay: {predicted_delay} days")
    print(f"Order value: ${order_value:,}")
    print(f"Budget cap: ${budget_cap:,}\n")

    for opt in prescriptions:
        print(f"Option {opt['id']}: {opt['action']}")
        print(f"  Cost: ${opt['cost_usd']:,}")
        print(f"  Time saved: {opt['time_saved_days']} days")
        print(f"  Feasible (within budget): {opt['feasible']}")
        print(f"  Cost per day saved: {opt['cost_per_day_saved']}")
        print()

    audit_passed = prove_constraint_never_violated(prescriptions, budget_cap)
    print(f"Optimization Audit — budget constraint never violated: {audit_passed}")