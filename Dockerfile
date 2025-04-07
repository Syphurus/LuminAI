# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv curl git

# Create and activate Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip and install Python packages
RUN pip install --upgrade pip
RUN pip install prisma==0.13.1 fastapi uvicorn

# Copy package files first
COPY package*.json ./

# Install Node.js deps including Prisma
RUN npm install

# Manually install Prisma packages
RUN npm install prisma @prisma/client

# Copy Prisma schema and env first
COPY prisma ./prisma
COPY .env .env

# ⚠️ Set env before running generate
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# ✅ Now generate the Prisma client
RUN npx prisma generate --schema=prisma/schema.prisma

# Copy the rest of the app AFTER generation
COPY . .

# Generate Python Prisma client
RUN python -m prisma generate

# Build your frontend
RUN npm run build

# Expose ports
EXPOSE 3000 8000 8001 8002 8003 8004

# Start app
CMD ["npm", "start"]
