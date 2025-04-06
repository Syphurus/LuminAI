# Start from official Node image
FROM node:18-bullseye

# Install Python and other tools
RUN apt-get update && apt-get install -y python3 python3-pip postgresql-client supervisor

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy everything else
COPY . .

# Build the Next.js app for production
RUN npm run build

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Install Prisma client
RUN npx prisma generate

# Expose all ports needed
EXPOSE 3000 8000 8001 8002 8003 8004 5555

# Copy supervisord config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Start services via Supervisor
CMD ["/usr/bin/supervisord", "-n"]
