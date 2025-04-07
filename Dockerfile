# Use Node.js base image (Debian Bullseye) which includes Python
FROM node:18-bullseye

# Install system dependencies: Python, pip, PostgreSQL client, and Supervisor
RUN apt-get update && apt-get install -y \
    python3 python3-pip postgresql-client supervisor

# Set working directory
WORKDIR /app

# Copy package files and install Node dependencies
COPY package*.json ./
# Install Prisma packages with specific versions (adjust as needed)
RUN npm install prisma@5.17.0 @prisma/client@5.17.0
RUN npm install

# Copy the Prisma folder so the schema is available
COPY prisma ./prisma
# Debug: list files in the prisma folder to confirm schema.prisma is present
RUN ls -la prisma

# Generate the Node.js Prisma client using the explicit schema path
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy the rest of the project files
COPY . .

# Build the Next.js frontend
RUN npm run build

# Copy Python requirements and install Python dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# (Optional) Generate the Python Prisma client if your Python code uses it.
# Make sure you have configured it properly in your project.
RUN python -m prisma generate

# Expose necessary ports (adjust as needed)
EXPOSE 3000 8000 8001 8002 8003 8004 5555

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Start all services via Supervisor
CMD ["/usr/bin/supervisord", "-n"]
