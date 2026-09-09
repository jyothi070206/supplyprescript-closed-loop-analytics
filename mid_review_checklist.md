# Mid-Project Review Checklist — SupplyPrescript

## What gets checked (per Axlero SOP)
Week 1 + Week 2 implementations only.

## Week 1 — Predictive Baseline + App Scaffolding
- [x] XGBoost model trained on mock supply chain data 
      (delay_prediction_model.pkl)
- [x] Model evaluated with accuracy + classification report
- [x] Next.js dashboard scaffolded

## Week 2 — Mathematical Optimization + Prescriptive UI
- [x] SciPy-based prescriptive solver generating 3 alternatives 
      (Air Freight, Secondary Supplier, Delay Launch)
- [x] Hard budget constraint enforced and audited across 5 scenarios 
      (optimization_audit.md)
- [x] Prescriptive UI cards showing cost/time trade-offs, with a 
      "Best Value" indicator

## Mid-Review specific checks
- [x] Optimization Audit: proven the solver never mislabels an 
      over-budget option as feasible
- [x] Write-Back Check: proven Execute Decision performs a real 
      INSERT into the operational database (write_back_check.md)
- [ ] GitHub commit activity: 10+ distinct days in the 14 days before 
      review (in progress)

## Documents ready for review
- optimization_audit.md
- write_back_check.md
- README.md (daily progress log)