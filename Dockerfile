# --- Base image for Node + Python ---
    FROM node:18-bullseye as base

    # Set working directory
    WORKDIR /app
    
    # Install system dependencies for Python
    RUN apt-get update && apt-get install -y python3 python3-pip python3-venv curl git
    
    # Install Python dependencies
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    
    # Install Prisma CLI
    RUN npm install -g prisma
    
    # Install project dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy Prisma schema
    COPY prisma ./prisma
    
    # Set dummy DATABASE_URL just for build-time Prisma generation
    ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/db"
    
    # Generate Prisma clients
    RUN npx prisma generate --schema=prisma/schema.prisma
    RUN python -m prisma generate
    
    # Copy the rest of the project
    COPY . .
    
    # --- Build Next.js frontend ---
    RUN npm run build
    
    # --- Expose ports ---
    # Next.js default: 3000
    # Python APIs: 8000–8004
    EXPOSE 3000 8000 8001 8002 8003 8004
    
    # --- Run all services ---
    CMD bash start.sh
    