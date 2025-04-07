FROM node:18

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# ----------------------------
# Install Node dependencies
# ----------------------------
RUN npm install

# ----------------------------
# Install Python + venv
# ----------------------------
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Create virtual environment
RUN python3 -m venv /opt/venv

# Activate venv + install Python dependencies
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip
RUN pip install "prisma==0.13.1" "fastapi" "uvicorn"

# ----------------------------
# Match Node + Python Prisma engines
# ----------------------------
# Manually pin Prisma CLI to match Python client hash
# First, install exact version that matches `prisma-client-py` engine hash
# Ref: https://github.com/RobertCraigie/prisma-client-py#compatibility

RUN npm install prisma@5.17.0 --save-dev
RUN npx prisma generate

# Then, generate the Python Prisma client
RUN prisma generate --generator=prisma-client-py

# ----------------------------
# Build Next.js frontend
# ----------------------------
RUN npm run build

# ----------------------------
# Expose ports
# ----------------------------
EXPOSE 3000 8000 8001 8002 8003 8004

# ----------------------------
# Start all services
# ----------------------------
CMD bash -c "\
    uvicorn '(backend).summarize:app' --port 8000 & \
    uvicorn '(backend).image_generation:app' --port 8001 & \
    uvicorn '(backend).video_generator:app' --port 8002 & \
    uvicorn '(backend).ghibli:app' --port 8003 & \
    uvicorn '(backend).svg_generator:app' --port 8004 & \
    npm run start"
