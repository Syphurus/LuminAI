# Base image with Node + Python
FROM node:18

# Set working directory
WORKDIR /app

# Install Python + pip + venv
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Set up Python venv and install Prisma client
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip
RUN pip install prisma==0.13.1 prisma-client-py==0.13.1 fastapi uvicorn

# Install Node dependencies
COPY package*.json ./
RUN npm install
RUN npm install prisma@5.11.0 @prisma/client@5.11.0

# Copy the rest of the code
COPY . .

# Generate Prisma clients
RUN npx prisma generate
RUN python -m prisma generate

# Build the frontend
RUN npm run build

# Ports (adjust as needed)
EXPOSE 3000 8000 8001 8002 8003

CMD ["npm", "start"]
