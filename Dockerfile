# Base image
FROM node:18-bullseye

# Install Python, pip, PostgreSQL client, and Supervisor
RUN apt-get update && \
    apt-get install -y python3 python3-pip postgresql-client supervisor && \
    pip3 install --upgrade pip

# Install Prisma CLI (Node.js)
RUN npm install -g prisma

# Install Python Prisma CLI (note: only install `prisma`, NOT `prisma-client-py`)
RUN pip3 install prisma

# Set working directory
WORKDIR /app

# Copy only package files and Prisma schema initially for caching
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

# Copy the rest of the project
COPY . .

# Generate Prisma clients
RUN prisma generate

# Build Next.js project
RUN npm run build

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Expose frontend + backend ports
EXPOSE 3000 8000 8001 8002 8003 8004 5555

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Start all services using Supervisor
CMD ["/usr/bin/supervisord", "-n"]
