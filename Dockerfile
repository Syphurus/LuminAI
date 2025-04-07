FROM node:18

WORKDIR /app

COPY . .

# -------------------
# Node dependencies
# -------------------
RUN npm install

# Prisma CLI compatible with Python Prisma
RUN npm install prisma@5.11.0 --save-dev

# -------------------
# Python setup
# -------------------
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv

# Create and activate virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python Prisma client *before* prisma generate
RUN pip install --upgrade pip
RUN pip install "prisma==0.13.1" "prisma-client-py==0.13.1" fastapi uvicorn

# -------------------
# Now generate both Node + Python clients
# -------------------
RUN npx prisma generate

# -------------------
# Build Next.js frontend
# -------------------
RUN npm run build

EXPOSE 3000 8000 8001 8002 8003 8004

CMD bash -c "\
    uvicorn '(backend).summarize:app' --port 8000 & \
    uvicorn '(backend).image_generation:app' --port 8001 & \
    uvicorn '(backend).video_generator:app' --port 8002 & \
    uvicorn '(backend).ghibli:app' --port 8003 & \
    uvicorn '(backend).svg_generator:app' --port 8004 & \
    npm run start"
