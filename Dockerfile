# Use Node base image with Python support
FROM node:18-bullseye

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv curl git postgresql-client supervisor

# Create and activate a Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip and install Python dependencies (including Prisma for Python)
RUN pip install --upgrade pip
RUN pip install prisma==0.13.1 fastapi uvicorn

# Copy Node package files and install Node dependencies (including Prisma JS client)
COPY package*.json ./
RUN npm install prisma@5.17.0 @prisma/client@5.17.0
RUN npm install

# Copy the Prisma schema folder so that the schema is available
COPY prisma ./prisma
# Debug: list contents of prisma folder (should show schema.prisma)
RUN ls -la prisma

# Generate Prisma clients using the explicit schema path
RUN npx prisma generate --schema=prisma/schema.prisma
RUN python -m prisma generate

# Copy the rest of the project files
COPY . .

# Build the Next.js frontend
RUN npm run build

# Expose necessary ports (adjust as needed)
EXPOSE 3000 8000 8001 8002 8003 8004 5555

# Copy Supervisor configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Start all services via Supervisor
CMD ["/usr/bin/supervisord", "-n"]
