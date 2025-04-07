FROM node:18

WORKDIR /app

COPY . .

# Install Node.js deps and correct Prisma version
RUN npm install
RUN npm install prisma@5.11.0 --save-dev

# Install Python, pip, and virtual environment
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Set up virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install "prisma==0.13.1" fastapi uvicorn

# Generate Node Prisma client
RUN npx prisma generate --schema=prisma/schema.prisma

# Generate Python Prisma client
RUN python3 -m prisma generate

# Build the Next.js app
RUN npm run build

EXPOSE 3000 8000 8001 8002 8003 8004

CMD bash -c "\
    uvicorn '(backend).summarize:app' --port 8000 & \
    uvicorn '(backend).image_generation:app' --port 8001 & \
    uvicorn '(backend).video_generator:app' --port 8002 & \
    uvicorn '(backend).ghibli:app' --port 8003 & \
    uvicorn '(backend).svg_generator:app' --port 8004 & \
    npm run start"
