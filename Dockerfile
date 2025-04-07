# --- Use Node.js as the base image ---
    FROM node:18-bullseye

    # --- Install system dependencies ---
    RUN apt-get update && apt-get install -y \
        python3 python3-pip postgresql-client supervisor
    
    # --- Set working directory ---
    WORKDIR /app
    
    # --- Set a temporary DATABASE_URL for Prisma generation ---
    # Replace with your actual connection string or set via environment variables at runtime.
    ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"
    
    # --- Copy package files and install Node.js dependencies ---
    COPY package*.json ./
    RUN npm install
    
    # --- Copy Prisma schema folder (ensure your schema is at prisma/schema.prisma) ---
    COPY prisma ./prisma
    
    # --- Generate Node.js Prisma client (uses DATABASE_URL above) ---
    RUN npx prisma generate --schema=prisma/schema.prisma
    
    # --- Copy the rest of the project files ---
    COPY . .
    
    # --- Build Next.js app ---
    RUN npm run build
    
    # --- Install Python dependencies ---
    COPY requirements.txt .
    RUN pip3 install -r requirements.txt
    
    # --- Expose ports as needed ---
    EXPOSE 3000 8000 8001 8002 8003 8004 5555
    
    # --- Copy Supervisor configuration ---
    COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
    
    # --- Start services via Supervisor ---
    CMD ["/usr/bin/supervisord", "-n"]
    