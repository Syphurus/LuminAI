# ----------------------------
# 🧱 Base stage for dependencies
# ----------------------------
    FROM node:18 AS base

    WORKDIR /app
    
    # Copy all project files
    COPY . .
    
    # ----------------------------
    # 📦 Install dependencies
    # ----------------------------
    RUN npm install
    
    # ----------------------------
    # ⚙️ Install Python & Pipenv
    # ----------------------------
    RUN apt-get update && apt-get install -y python3 python3-pip
    
    # Install Python dependencies
    RUN pip3 install --upgrade pip
    RUN pip3 install prisma fastapi uvicorn
    
    # ----------------------------
    # 🔧 Generate Prisma Clients
    # ----------------------------
    
    # Node.js Prisma Client (for Next.js)
    RUN npx prisma generate --schema=prisma/schema.prisma
    
    # Python Prisma Client (used in FastAPI)
    # Use the Python Prisma generator here
    RUN prisma generate --generator=prisma-client-py
    
    # ----------------------------
    # 🏗 Build Next.js frontend
    # ----------------------------
    RUN npm run build
    
    # ----------------------------
    # 🐳 Final stage: fullstack production
    # ----------------------------
    FROM node:18
    
    WORKDIR /app
    
    COPY --from=base /app /app
    
    # Install serve for static hosting
    RUN npm install -g serve
    
    # ----------------------------
    # 🌐 Expose ports for all backends
    # ----------------------------
    EXPOSE 3000 8000 8001 8002 8003 8004
    
    # ----------------------------
    # 🚀 Start all servers
    # ----------------------------
    CMD bash -c " \
        uvicorn '(backend).summarize:app' --port 8000 & \
        uvicorn '(backend).image_generation:app' --port 8001 & \
        uvicorn '(backend).video_generator:app' --port 8002 & \
        uvicorn '(backend).ghibli:app' --port 8003 & \
        uvicorn '(backend).svg_generator:app' --port 8004 & \
        serve -s out -l 3000"
    