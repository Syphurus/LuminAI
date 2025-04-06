# Start from official Node image
FROM node:18-bullseye

# Install Python and other tools
RUN apt-get update && apt-get install -y python3 python3-pip postgresql-client supervisor

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
COPY prisma ./prisma

# Install Node.js dependencies
RUN npm install

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt \
    && pip3 install prisma-client-py

# Generate Prisma clients (Node.js + Python)
RUN npx prisma generate

# Copy the rest of the project files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose frontend and backend ports
EXPOSE 3000 8000 8001 8002 8003 8004 5555

# Copy Supervisor config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Start all services using Supervisor
CMD ["/usr/bin/supervisord", "-n"]
