# Use Node base image with Python
FROM node:18-bullseye

# Install system dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip postgresql-client supervisor && \
    pip3 install --upgrade pip

# Install Prisma for Node.js (JavaScript client)
RUN npm install -g prisma

# Install Prisma CLI for Python (do NOT install prisma-client-py directly)
RUN pip3 install prisma

# Set working directory
WORKDIR /app

# Copy only Prisma schema early for better caching
COPY prisma ./prisma

# Generate Prisma clients
RUN prisma generate

# Copy frontend package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy everything else
COPY . .

# Run the generate command again (to ensure generated clients after code copy)
RUN prisma generate

# Build the Next.js project (this needs Prisma JS client ready)
RUN npm run build

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Expose ports
EXPOSE 3000 8000 8001 8002 8003 8004 5555

# Add supervisord config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Start all services
CMD ["/usr/bin/supervisord", "-n"]
