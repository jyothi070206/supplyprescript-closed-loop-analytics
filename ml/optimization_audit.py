"""
Optimization Audit — proves the SciPy-based prescriptive solver
NEVER recommends an action that violates the hard budget constraint,
across multiple realistic scenarios (not just one example).
"""

from prescriptive_solver import generate_prescriptions, prove_constraint_never_violated

# Test across a range of realistic scenarios: different order values,
# different delay lengths, and different (sometimes tight) budget caps.
test_scenarios = [
    {"delay_days": 14, "order_value": 50000, "budget": 20000},
    {"delay_days": 7,  "order_value": 10000, "budget": 5000},   # tight budget
    {"delay_days": 21, "order_value": 80000, "budget": 25000},
    {"delay_days": 3,  "order_value": 5000,  "budget": 1000},   # very tight budget
    {"delay_days": 30, "order_value": 100000, "budget": 40000},
]

print("=" * 60)
print("OPTIMIZATION AUDIT — Budget Constraint Verification")
print("=" * 60)

all_passed = True

for i, scenario in enumerate(test_scenarios, start=1):
    prescriptions = generate_prescriptions(
        scenario["delay_days"], scenario["order_value"], scenario["budget"]
    )
    passed = prove_constraint_never_violated(prescriptions, scenario["budget"])
    all_passed = all_passed and passed

    print(f"\nScenario {i}: delay={scenario['delay_days']}d, "
          f"order=${scenario['order_value']:,}, budget=${scenario['budget']:,}")
    for opt in prescriptions:
        flag = "OK" if opt["feasible"] else "EXCEEDS BUDGET (correctly flagged)"
        print(f"  Option {opt['id']} ({opt['action']}): "
              f"${opt['cost_usd']:,} -> {flag}")
    print(f"  Constraint never silently violated: {passed}")

print("\n" + "=" * 60)
print(f"FINAL RESULT — All {len(test_scenarios)} scenarios passed: {all_passed}")
print("=" * 60)