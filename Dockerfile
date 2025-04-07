# Base image
FROM node:18-bullseye AS base

# Set working directory
WORKDIR /app

# Install Python and system dependencies
RUN apt-get update && apt-get install -y \
  python3 \
  python3-pip \
  python3-venv \
  curl \
  git \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

# Install Rust (required for prisma Python client)
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Copy Python requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Prisma CLI globally for Node.js client
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Install Node.js dependencies (without copying entire app yet for better cache)
COPY package.json package-lock.json ./
RUN npm install

# Generate Prisma clients
RUN npx prisma generate --schema=prisma/schema.prisma
RUN python -m prisma generate

# Copy remaining app files
COPY . .

# Build frontend (Next.js)
RUN npm run build

# Expose your desired port (optional)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
