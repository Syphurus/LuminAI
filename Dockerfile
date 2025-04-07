# Start from Node.js base image with Python
FROM node:18

# Set working directory
WORKDIR /app

# Install system dependencies (Python, pip, curl, venv)
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv curl git

# Create virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip
RUN pip install --upgrade pip

# Install Python Prisma client + FastAPI deps
RUN pip install prisma==0.13.1 prisma-client-py==0.13.1 fastapi uvicorn

# Copy Node files and install Node deps
COPY package*.json ./
RUN npm install
RUN npm install prisma@5.17.0 --save-dev
RUN npm install @prisma/client

# Copy the rest of the app
COPY . .

# Run prisma generate for both JS and Python
RUN npx prisma generate --schema=prisma/schema.prisma
RUN python -m prisma generate

# Build the Next.js app
RUN npm run build

# Expose frontend + backend ports
EXPOSE 3000 8000 8001 8002 8003 8004

# Start Next.js (you can customize this to run uvicorn too)
CMD ["npm", "start"]
