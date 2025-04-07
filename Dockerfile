# Start from Node.js base image with Python
FROM node:18

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv curl git

# Create virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip
RUN pip install --upgrade pip

# ✅ Install only compatible Python Prisma client
RUN pip install "prisma==0.13.1" fastapi uvicorn

# Copy Node files and install compatible Node Prisma packages
COPY package*.json ./
RUN npm install
RUN npm install prisma@5.11.0 @prisma/client@5.11.0

# Copy the rest of the app
COPY . .

# ✅ Generate Prisma client using Node (matching version)
RUN npx prisma generate --schema=prisma/schema.prisma

# ✅ Generate Prisma client using Python
RUN python -m prisma generate

# Build the frontend
RUN npm run build

# Expose all ports
EXPOSE 3000 8000 8001 8002 8003 8004

# Run app (customize this as needed)
CMD ["npm", "start"]
