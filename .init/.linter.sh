#!/bin/bash
cd /home/kavia/workspace/code-generation/nutrimeal-planner-104956-104965/meal_planner_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

