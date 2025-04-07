# ----------------------------
# 🧱 Base image for everything
# ----------------------------
    FROM node:18

    WORKDIR /app
    
    # Copy full project
    COPY . .
    
    # ----------------------------
    # 📦 Install Node dependencies
    # ----------------------------
    RUN npm install
    
    # ----------------------------
    # 🐍 Install Python + virtualenv
    # ----------------------------
    RUN apt-get update && apt-get install -y python3 python3-venv python3-pip
    
    # Create virtual environment
    RUN python3 -m venv /opt/venv
    
    # Activate virtual environment and install Python dependencies
    ENV PATH="/opt/venv/bin:$PATH"
    RUN pip install --upgrade pip && pip install prisma fastapi uvicorn
    
    # ----------------------------
    # ⚙️ Generate Prisma clients
    # ----------------------------
    
    # Node client
    RUN npx prisma generate --schema=prisma/schema.prisma
    
    # Python client
    RUN prisma generate --generator=prisma-client-py
    
    # ----------------------------
    # 🧱 Build Next.js frontend
    # ----------------------------
    RUN npm run build
    
    # ----------------------------
    # 🌐 Expose frontend + backend ports
    # ----------------------------
    EXPOSE 3000 8000 8001 8002 8003 8004
    
    # ----------------------------
    # 🚀 Start all services
    # ----------------------------
    CMD bash -c " \
        uvicorn '(backend).summarize:app' --port 8000 & \
        uvicorn '(backend).image_generation:app' --port 8001 & \
        uvicorn '(backend).video_generator:app' --port 8002 & \
        uvicorn '(backend).ghibli:app' --port 8003 & \
        uvicorn '(backend).svg_generator:app' --port 8004 & \
        npx serve -s out -l 3000"
    