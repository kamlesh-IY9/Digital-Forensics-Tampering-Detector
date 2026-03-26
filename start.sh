#!/bin/bash
echo "================================================"
echo "  Digital Forensics Tampering Detector"
echo "  M.Sc Final Year Project"
echo "  Brainybeam Info-Tech PVT LTD"
echo "================================================"
echo ""
echo "[1/3] Installing Python dependencies..."
cd backend && pip install -r requirements.txt -q
cd ..
echo "[2/3] Installing Node dependencies..."
cd frontend && npm install -q
cd ..
echo "[3/3] Starting servers..."
npm start
