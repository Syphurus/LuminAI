FROM node:18

WORKDIR /app

COPY . .

# Install Node dependencies
RUN npm install

# Install Prisma CLI v5.11.0 (compatible with Python Prisma client)
RUN npm install prisma@5.11.0 --save-dev

# Generate Node Prisma client
RUN npx prisma generate

# Set up Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Create and activate virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python packages including compatible Prisma version
RUN pip install --upgrade pip
RUN pip install "prisma==0.13.1" fastapi uvicorn

# Generate Python Prisma client
RUN python3 -m prisma generate

# Now the Prisma clients are ready, so build the app
RUN npm run build

# Expose ports
EXPOSE 3000 8000 8001 8002 8003 8004

# Start everything (backend + frontend)
CMD bash -c "\
    uvicorn '(backend).summarize:app' --port 8000 & \
    uvicorn '(backend).image_generation:app' --port 8001 & \
    uvicorn '(backend).video_generator:app' --port 8002 & \
    uvicorn '(backend).ghibli:app' --port 8003 & \
    uvicorn '(backend).svg_generator:app' --port 8004 & \
    npm run start"
