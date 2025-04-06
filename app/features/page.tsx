"use client";

import { motion } from "framer-motion";
import { FiFileText, FiImage, FiVideo } from "react-icons/fi";
import Navbar from "@/components/Navbar";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white flex flex-col">
      <Navbar />

      <section className="mt-40 px-6 md:px-12">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Explore Our Powerful Features
        </motion.h1>
        <p className="text-lg text-gray-200 text-center max-w-2xl mx-auto mb-24">
          Unlock the full potential of AI to generate content effortlessly. From
          summaries to stunning visuals and videos—everything you need is just a
          few clicks away.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FiFileText size={32} />}
            title="Summarize Text"
            description="Quickly condense articles, notes, and documents into clear, concise summaries using powerful AI."
            link="/dashboard/summarize"
          />
          <FeatureCard
            icon={<FiImage size={32} />}
            title="Generate Image"
            description="Turn your imagination into reality by generating images directly from your text prompts."
            link="/dashboard/generate-image"
          />
          <FeatureCard
            icon={<FiVideo size={32} />}
            title="Generate Video"
            description="Bring stories to life with text-to-video generation, powered by cutting-edge animation tools."
            link="/dashboard/generate-video"
          />
          <FeatureCard
            icon={<FiImage size={32} />}
            title="Ghibli Image Generator"
            description="Transform photos into Studio Ghibli-style artwork with AI magic and artistic flair."
            link="/dashboard/ghibli_image_generator"
          />
          <FeatureCard
            icon={<FiImage size={32} />}
            title="SVG Generator"
            description="Generate beautiful and scalable vector graphics (SVGs) from simple prompts instantly."
            link="/dashboard/generate_svg"
          />
        </div>
      </section>

      <footer className="mt-24 py-6 text-center bg-white/10 backdrop-blur-md">
        <p className="text-gray-300">
          &copy; 2025 AI Generator. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

const FeatureCard = ({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) => {
  return (
    <motion.a
      href={link}
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 p-6 rounded-xl shadow-lg flex flex-col items-center text-center transition-all hover:bg-white/20"
    >
      <div className="text-white bg-indigo-500 p-4 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-200 mt-2">{description}</p>
    </motion.a>
  );
};
