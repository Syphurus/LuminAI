# Use Node.js base with Debian (for Python)
FROM node:18-bullseye

# Install Python and tools
RUN apt-get update && \
    apt-get install -y python3 python3-pip postgresql-client supervisor && \
    pip3 install --upgrade pip

# Install global Prisma CLI for JS
RUN npm install -g prisma

# Install Python Prisma CLI
RUN pip3 install prisma

# Set working directory
WORKDIR /app

# Copy package files and install JS deps early (cache layer)
COPY package*.json ./
RUN npm install

# Copy entire project now (this includes prisma/ and everything else)
COPY . .

# Install JS Prisma client (needed by Next.js build)
RUN npm install @prisma/client

# 🔥 Forcefully regenerate Prisma clients AFTER full copy
RUN npx prisma generate

# Build Next.js app (JS Prisma client now guaranteed)
RUN npm run build

# Install Python backend deps
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Expose ports
EXPOSE 3000 8000 8001 8002 8003 8004 5555

# Add supervisord config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Start everything
CMD ["/usr/bin/supervisord", "-n"]
