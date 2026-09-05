# Continuous Learning Pipeline

## Purpose
Automatically detect when the prescriptive system's cost predictions 
are significantly wrong (per real-world outcomes recorded in the 
Closed Loop) and trigger a re-training of the XGBoost model — closing 
the loop from "recommendation" to "recommendation that improves over 
time."

## Trigger Logic
- Pulls all evaluated decisions from `/closed-loop-summary`
- Flags any decision where actual cost differed from predicted cost 
  by more than 10%
- If one or more significant discrepancies are found, automatically 
  re-trains the XGBoost delay-prediction model

## Test Result
Ran the pipeline after recording the Day 8 outcome (Air Freight: 
predicted $15,000, actual $18,000 — a 20% discrepancy). The pipeline 
correctly identified this as significant, triggered re-training, and 
produced an updated model with reported accuracy.

## Production Note
This prototype re-trains on the original historical dataset to 
demonstrate the trigger mechanism end-to-end. A production version 
would blend the new actual-outcome records into the training set 
before re-fitting, so the model directly learns from its own past 
mistakes.