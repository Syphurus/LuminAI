# AI Content Generator

AI Content Generator is a powerful web application that allows users to generate AI-powered content such as text summaries, images, videos, and SVGs. It also includes a magical Studio Ghibli-style image generator.

## Features

- **Summarize Text**: Quickly condense articles, reports, or long documents using AI-powered summarization.
- **Generate Images**: Create stunning visuals by describing them in text.
- **Generate Videos**: Convert your ideas into AI-generated animated videos from simple prompts.
- **Ghibli Image Generator**: Transform photos into magical Studio Ghibli-style visuals.
- **SVG Generator**: Generate clean and scalable SVG illustrations powered by AI.

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, PostgreSQL, Prisma
- **Authentication**: Clerk
- **Icons**: React Icons

## Installation

### Prerequisites

- Node.js and npm installed
- Python 3.9+ installed
- PostgreSQL installed and running
- Prisma installed globally (`npm install -g prisma`)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ai-content-generator.git
   cd ai-content-generator

   ```

2. Install dependencies:

   # Install Node.js dependencies

   npm install

   # Install Python dependencies

   pip install -r requirements.txt

3. Set up the environment variables:
   Create a .env file in the root directory and add the following:
   DATABASE_URL=your_postgresql_connection_string
   PGPASSWORD=your_postgres_password

4. Set up the database:
   npx prisma migrate dev

5. Start the application:
   ./start.sh

6. Access the application:
   Frontend: http://localhost:3000
   Prisma Studio: http://localhost:5555
   Backend services:
   Summarize: http://localhost:8000
   Image Generation: http://localhost:8001
   Video Generation: http://localhost:8002
   Ghibli Generator: http://localhost:8003
   SVG Generator: http://localhost:8004

7. Stopping the Application
   To stop all running services, use the stop.sh script:
   [stop.sh](http://_vscodecontentref_/1)

# License

    This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

    Contributions are welcome! Please open an issue or submit a pull request.
