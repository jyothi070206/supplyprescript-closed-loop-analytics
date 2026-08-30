# Optimization Audit — SciPy Prescriptive Solver

## Purpose
Verify that the prescriptive solver never recommends an action that 
violates the hard budget constraint defined in the system — even when 
tested against tight, unrealistic, or edge-case budgets.

## Method
Ran `generate_prescriptions()` across 5 different scenarios, varying 
predicted delay length, order value, and budget cap (including two 
deliberately tight budgets designed to try to trigger a violation).

## Result
All 5 scenarios passed. Every option that would exceed the budget was 
correctly flagged as `feasible: False` rather than silently 
recommended — proving the constraint logic holds under varied and 
adversarial input, not just the original single example from the 
project brief.

## Conclusion
The prescriptive engine is safe to present cost-constrained 
recommendations to a business user without risk of silently 
proposing a financially infeasible action.