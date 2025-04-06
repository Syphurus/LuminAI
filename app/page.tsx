"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { FiFileText, FiImage, FiVideo } from "react-icons/fi";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 md:px-12 mt-40">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Generate AI-Powered Content <br /> in Seconds
        </motion.h1>
        <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-2xl">
          Summarize text, create AI-generated videos, and turn words into images
          or SVGs — all in one place.
        </p>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <SignInButton>
            <Button
              className="px-6 py-3 bg-white text-indigo-600 font-semibold text-lg rounded-lg hover:bg-gray-200 transition-all"
              type="button"
            >
              {isSignedIn ? "Go to Dashboard" : "Get Started"}
            </Button>
          </SignInButton>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="mt-24 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-8">What You Can Do</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FiFileText size={32} />}
            title="Summarize Text"
            description="Quickly condense articles, reports, or long documents using AI-powered summarization."
          />
          <FeatureCard
            icon={<FiImage size={32} />}
            title="Generate Image"
            description="Create stunning visuals by describing them in text. Ideal for creative workflows."
          />
          <FeatureCard
            icon={<FiVideo size={32} />}
            title="Generate Video"
            description="Convert your ideas into AI-generated animated videos from simple prompts."
          />
          <FeatureCard
            icon={<FiImage size={32} />}
            title="Ghibli Image Generator"
            description="Transform photos into magical Studio Ghibli-style visuals using AI."
          />
          <FeatureCard
            icon={<FiImage size={32} />}
            title="SVG Generator"
            description="Generate clean and scalable SVG illustrations powered by AI."
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="mt-24 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-8">What Users Say</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <TestimonialCard
            name="Alex Johnson"
            text="This AI generator has saved me hours of work! The summarization tool is a game-changer."
          />
          <TestimonialCard
            name="Sophia Lee"
            text="I love how easy it is to create AI-generated videos and images. Highly recommended!"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 py-6 text-center bg-white/10 backdrop-blur-md">
        <p className="text-gray-300">
          &copy; 2025 AI Generator. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <motion.div
      className="bg-white/10 p-6 rounded-xl shadow-lg flex flex-col items-center text-center"
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-white bg-indigo-500 p-4 rounded-full">{icon}</div>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="text-gray-200 mt-2">{description}</p>
    </motion.div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ name, text }: { name: string; text: string }) => {
  return (
    <motion.div
      className="bg-white/10 p-6 rounded-xl shadow-lg text-center max-w-md"
      whileHover={{ scale: 1.05 }}
    >
      <p className="text-gray-200 italic">"{text}"</p>
      <h3 className="mt-4 text-lg font-semibold">{name}</h3>
    </motion.div>
  );
};
