# --- Use Node.js as the base image ---
    FROM node:18

    # --- Set working directory ---
    WORKDIR /app
    
    # --- Install system dependencies ---
    RUN apt-get update && apt-get install -y \
        python3 python3-pip python3-venv curl git
    
    # --- Set up Python virtual environment ---
    RUN python3 -m venv /opt/venv
    ENV PATH="/opt/venv/bin:$PATH"
    
    # --- Upgrade pip and install Python Prisma + FastAPI ---
    RUN pip install --upgrade pip
    RUN pip install prisma==0.13.1 fastapi uvicorn
    
    # --- Copy package.json and install Node.js dependencies ---
    COPY package*.json ./
    RUN npm install
    
    # --- Install specific Prisma versions (Node.js) ---
    RUN npm install prisma@5.11.0 @prisma/client@5.11.0
    
    # --- Copy rest of the project files ---
    COPY . .
    
    # --- Generate Prisma clients (Python and Node.js) ---
    RUN python -m prisma generate
    RUN npx prisma generate
    
    # --- Build frontend ---
    RUN npm run build
    
    # --- Expose frontend and backend ports ---
    EXPOSE 3000 8000 8001 8002 8003
    
    # --- Start the app (adjust this if using next start or a custom server) ---
    CMD ["npm", "start"]
    