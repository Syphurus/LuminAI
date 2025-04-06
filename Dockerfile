# Start from official Node image with Python preinstalled
FROM node:18-bullseye

# Install Python and required system packages
RUN apt-get update && apt-get install -y python3 python3-pip postgresql-client supervisor curl

# Install global Prisma CLI (needed for Python Prisma generation)
RUN npm install -g prisma

# Install Python Prisma CLI
RUN pip3 install 'prisma-client-py[cli]'

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY requirements.txt ./
COPY prisma ./prisma

# Install Node dependencies
RUN npm install

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Generate both Prisma clients
RUN prisma generate

# Copy all other project files
COPY . .

# Build Next.js frontend
RUN npm run build

# Expose all necessary ports
EXPOSE 3000 8000 8001 8002 8003 8004 5555

# Add supervisor config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Start all services
CMD ["/usr/bin/supervisord", "-n"]
