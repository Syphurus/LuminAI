# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv curl git

# Create and activate Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip and install Python packages
RUN pip install --upgrade pip
RUN pip install prisma==0.13.1 fastapi uvicorn

# Copy only package.json and lock first for caching
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# --- 🔥 Install Prisma CLI and @prisma/client manually ---
RUN npm install prisma@5.11.0 @prisma/client@5.11.0

# Copy Prisma schema before generating
COPY prisma ./prisma

# 🔁 Generate the Node.js Prisma client (REQUIRES schema and @prisma/client present)
RUN npx prisma generate --schema=prisma/schema.prisma

# Copy the rest of your codebase
COPY . .

# Generate Python Prisma client
RUN python -m prisma generate

# Build your frontend
RUN npm run build

# Expose necessary ports
EXPOSE 3000 8000 8001 8002 8003 8004

# Start your server
CMD ["npm", "start"]
