#!/bin/bash
cd /sessions/happy-exciting-brahmagupta/mnt/AI_Governece_Platform

export PORT=8080
export NODE_ENV=production
export XAI_API_KEY=xai-8iB1zwfhxOGLH7VcgsD4SUHMOW9lpWJgagHrqL5ZbjUtBz09F96Sgi8B60MNIqKEjB8dDUBqDHwV6C92
export XAI_API_URL=https://api.x.ai/v1
export XAI_MODEL=grok-4-latest
export JWT_SECRET=gngmeta-ai-governance-jwt-secret-2026

while true; do
  echo "[$(date)] Starting server..."
  node server/dist/index.js
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 2 seconds..."
  sleep 2
done
