#!/bin/bash

# Stop all Python services started by the start.sh script
echo "Stopping Python services..."
pkill -f "uvicorn"

# Stop Prisma Studio
echo "Stopping Prisma Studio..."
pkill -f "prisma studio"

# Stop PostgreSQL connection (if applicable)
echo "Stopping PostgreSQL connection..."
pkill -f "psql"

# Stop all npm run dev processes
echo "Stopping npm run dev processes..."
pkill -f "node"

echo "All services have been stopped!"