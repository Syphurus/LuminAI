# Use Node.js with Debian for Python compatibility
FROM node:18-bullseye

# Install Python, pip, PostgreSQL client, and supervisord
RUN apt-get update && \
    apt-get install -y python3 python3-pip postgresql-client supervisor && \
    pip3 install --upgrade pip

# Install Prisma CLI (for JS) globally
RUN npm install -g prisma

# Install Python Prisma client
RUN pip3 install prisma

# Set working directory
WORKDIR /app

# Copy only package files and prisma schema for layer caching
COPY package*.json ./
COPY prisma ./prisma

# Install JS dependencies and Prisma JS client
RUN npm install
RUN npm install @prisma/client

# ⚠️ Don't run `prisma generate` here yet — it will be invalidated

# Copy full project **after installing dependencies**
COPY . .

# ✅ Now run Prisma generate (after all files are present)
RUN prisma generate

# Now build the Next.js app (JS Prisma client will be present)
RUN npm run build

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Expose ports
EXPOSE 3000 8000 8001 8002 8003 8004 5555

# Copy supervisord config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Start everything
CMD ["/usr/bin/supervisord", "-n"]
