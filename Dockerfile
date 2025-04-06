# Base image
FROM node:18-bullseye

# Install Python and Prisma CLI
RUN apt-get update && apt-get install -y python3 python3-pip postgresql-client curl

# Set working directory
WORKDIR /app

# Install Prisma CLI globally (for generate step)
RUN npm install -g prisma

# Install Python prisma client
RUN pip3 install prisma

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN prisma generate

# Copy Node dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Expose ports
EXPOSE 3000 8000 8001 8002 8003 8004 5555

# Start services
CMD ["npm", "run", "start"]
