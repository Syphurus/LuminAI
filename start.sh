#!/bin/bash

# This script starts the PostgreSQL connection, Prisma Studio, and various Python services using Uvicorn.
# Make sure to give execute permission to this script before running it:
# chmod +x start.sh
# Usage: ./start.sh
# Check if .env file exists

#for running the script
echo "Starting services..."
npm run dev &
sleep 5  # Wait for npm to start

# Load environment variables
source .env

# Start PostgreSQL connection
echo "Starting PostgreSQL connection..."
psql -h localhost -p 5432 -U postgres -d postgres &
sleep 10  # Wait for PostgreSQL to start

# Start Prisma Studio
echo "Starting Prisma Studio..."
npx prisma studio &
sleep 10  # Wait for Prisma Studio to start

# Start Python services on different ports
echo "Starting Python services..."
uvicorn '(backend).summarize:app' --reload --port 8000 &
uvicorn '(backend).image_generation:app' --reload --port 8001 &
uvicorn '(backend).video_generator:app' --reload --port 8002 &
uvicorn '(backend).ghibli:app' --reload --port 8003 &
uvicorn '(backend).svg_generator:app' --reload --port 8004 &
echo "All services are running!"