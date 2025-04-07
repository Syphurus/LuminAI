# Base image with Node.js + Python
FROM node:20-bullseye

# Install Python, pip, and required system dependencies
RUN apt-get update && apt-get install -y \
  python3 python3-pip python3-venv \
  build-essential libpq-dev curl

# Set working directory
WORKDIR /app

# Copy full project including frontend and backend
COPY . .

# ----------------------------
# 🔧 Prisma setup
# ----------------------------

# Install specific compatible Prisma CLI version
RUN npm install -g prisma@5.17.0
RUN npm install @prisma/client@5.17.0

# Install Python Prisma client tool
RUN pip3 install prisma

# Allow Python Prisma client to skip version mismatch error
ENV PRISMA_PY_DEBUG_GENERATOR=1

# Generate Prisma clients (Node + Python)
RUN npx prisma generate

# ----------------------------
# 📦 Install frontend deps and build
# ----------------------------

RUN npm install
RUN npm run build

# ----------------------------
# 🐍 Install FastAPI dependencies
# ----------------------------

WORKDIR /app/(backend)

# Install backend Python dependencies
RUN pip3 install -r requirements.txt

# ----------------------------
# 🚀 Run both frontend + backend servers
# ----------------------------

WORKDIR /app

# Run all 5 FastAPI apps + Next.js server concurrently
CMD sh -c "\
  uvicorn '(backend).summarize:app' --host 0.0.0.0 --port 8000 & \
  uvicorn '(backend).image_generation:app' --host 0.0.0.0 --port 8001 & \
  uvicorn '(backend).video_generator:app' --host 0.0.0.0 --port 8002 & \
  uvicorn '(backend).ghibli:app' --host 0.0.0.0 --port 8003 & \
  uvicorn '(backend).svg_generator:app' --host 0.0.0.0 --port 8004 & \
  npm run start"
