# Use Node with Python and PostgreSQL tools
FROM node:18-bullseye

# Install Python and Postgres client
RUN apt-get update && apt-get install -y python3 python3-pip postgresql-client supervisor

WORKDIR /app

# Copy only what we need for initial install
COPY package*.json ./
COPY prisma ./prisma

# Install node dependencies (no postinstall here!)
RUN npm install

# Now copy everything else
COPY . .

# Build Next.js
RUN npm run build

# Install Python deps
RUN pip3 install -r requirements.txt

# Generate Prisma client
RUN npx prisma generate

# Expose all required ports
EXPOSE 3000 8000 8001 8002 8003 8004 5555

# Supervisor config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Start all services
CMD ["/usr/bin/supervisord", "-n"]
