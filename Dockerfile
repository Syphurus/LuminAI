# Use official Node image with Python preinstalled
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install Node dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install Prisma CLI
RUN npm install prisma@5.17.0 --save-dev

# Copy the rest of the app
COPY . .

# Generate Node Prisma client
RUN npx prisma generate --schema=prisma/schema.prisma

# Install Python & pip, create venv
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    python3 -m venv /opt/venv

# Activate venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies (no prisma-client-py needed anymore)
RUN pip install --upgrade pip
RUN pip install "prisma==0.13.1" fastapi uvicorn

# Generate Python Prisma client
RUN python3 -m prisma generate

# Build the Next.js app
RUN npm run build

# Expose frontend and backend ports
EXPOSE 3000 8000 8001 8002 8003 8004

# Start both frontend and backend as needed (customize this part)
CMD ["npm", "start"]
