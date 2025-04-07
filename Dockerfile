# Use Node.js base image with Debian Bullseye (includes Python)
FROM node:18-bullseye

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    postgresql-client \
    supervisor

# Set working directory
WORKDIR /app

# Set a temporary DATABASE_URL (replace with your actual connection string in production)
ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"

# Copy package files and install Node dependencies
COPY package*.json ./
# Install specific Prisma packages to ensure compatibility (adjust versions if needed)
RUN npm install prisma@5.11.0 @prisma/client@5.11.0
RUN npm install

# Copy Prisma schema folder so that it is available for client generation
COPY prisma ./prisma

# Generate Prisma Node.js client (using your Prisma schema)
RUN npx prisma generate --schema=prisma/schema.prisma

# Copy the rest of the project files
COPY . .

# Build the Next.js frontend (this will use the generated Node client)
RUN npm run build

# Copy Python requirements and install Python dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Expose all necessary ports (adjust if needed)
EXPOSE 3000 8000 8001 8002 8003 8004 5555

# Copy Supervisor configuration (to start all services)
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Start services via Supervisor
CMD ["/usr/bin/supervisord", "-n"]
