# Use Node.js with Debian for Python compatibility
FROM node:18-bullseye

# Install Python, pip, PostgreSQL client, and supervisord
RUN apt-get update && \
    apt-get install -y python3 python3-pip postgresql-client supervisor && \
    pip3 install --upgrade pip

# Install Prisma CLI (for JS) globally
RUN npm install -g prisma

# Install Python Prisma client (just 'prisma', not prisma-client-py[cli])
RUN pip3 install prisma

# Set working directory
WORKDIR /app

# Copy Prisma schema and generate early for caching
COPY prisma ./prisma

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
RUN npm install @prisma/client

# Generate both JS and Python Prisma clients
RUN prisma generate

# Copy the full app (backend, frontend, etc.)
COPY . .

# Re-run Prisma generate to cover overwritten schema/code
RUN prisma generate

# Build the Next.js app (needs JS Prisma client ready)
RUN npm run build

# Install Python backend dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Expose all ports
EXPOSE 3000 8000 8001 8002 8003 8004 5555

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Start all services
CMD ["/usr/bin/supervisord", "-n"]
