# --- Use Node.js as the base image ---
    FROM node:18

    # --- Working directory ---
    WORKDIR /app
    
    # --- System dependencies ---
    RUN apt-get update && apt-get install -y \
        python3 python3-pip python3-venv curl git
    
    # --- Create and activate Python virtualenv ---
    RUN python3 -m venv /opt/venv
    ENV PATH="/opt/venv/bin:$PATH"
    
    # --- Upgrade pip and install Python Prisma client ---
    RUN pip install --upgrade pip
    RUN pip install prisma==0.13.1 fastapi uvicorn
    
    # --- Install compatible Node.js Prisma dependencies ---
    COPY package*.json ./
    RUN npm install
    RUN npm install prisma@5.11.0 @prisma/client@5.11.0
    
    # --- Copy the rest of the app ---
    COPY . .
    
    # --- Generate Prisma Clients ---
    RUN python -m prisma generate
    RUN npx prisma generate --schema=prisma/schema.prisma
    
    # ✅ RE-RUN npm install to ensure @prisma/client is picked up in node_modules
    RUN npm install
    
    # --- Build frontend ---
    RUN npm run build
    
    # --- Expose ports (change if needed) ---
    EXPOSE 3000 8000 8001 8002 8003
    
    # --- Start your server here ---
    CMD ["npm", "start"]
    