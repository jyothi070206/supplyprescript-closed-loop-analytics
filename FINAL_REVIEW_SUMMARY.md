# Final Review Summary — SupplyPrescript

## What this project does
Predicts supply chain delays, prescribes 3 cost-audited alternative 
actions, lets an operator execute one (writing it to a real database), 
and later compares the predicted cost against the real outcome — 
automatically triggering model re-training when predictions are 
significantly wrong.

## Full stack
- **ML**: XGBoost (delay prediction), SciPy-based optimization 
  (prescriptive solver)
- **Backend**: FastAPI, deployed on Render
- **Database**: PostgreSQL (Neon, free tier)
- **Frontend**: Next.js, deployed on Vercel

## Key proof points
1. Optimization Audit — solver never mislabels a budget-violating 
   option as feasible (5 scenarios tested)
2. Write-Back Check — Execute Decision performs a real, verified 
   database INSERT
3. Closed Loop — predicted vs. actual cost comparison, tested with 
   a real 20% discrepancy scenario
4. Continuous Learning — discrepancy detection correctly triggers 
   model re-training
5. Fully live and public — not just a local demo

## Live demo flow (for presentation)
1. Open the live app
2. Point out the pipeline stepper (Predicted → Prescribed → Executed 
   → Evaluated)
3. Click Execute Decision on a card — show the confirmation and 
   pipeline advancing
4. Scroll to Decision ROI — show real predicted-vs-actual data
5. Use the Record Outcome form live — show the table update in 
   real time