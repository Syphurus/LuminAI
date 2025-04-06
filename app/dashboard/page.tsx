"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { FiFileText, FiImage, FiVideo } from "react-icons/fi";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto text-center"
    >
      <h1 className="text-4xl font-bold">Welcome, {user?.firstName} 👋</h1>
      <p className="text-gray-400 mt-2">
        Generate summaries, images, and videos with AI.
      </p>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <ActionCard
          href="/dashboard/summarize"
          icon={<FiFileText />}
          title="Summarize Text"
        />
        <ActionCard
          href="/dashboard/generate-image"
          icon={<FiImage />}
          title="Generate Image"
        />
        <ActionCard
          href="/dashboard/generate-video"
          icon={<FiVideo />}
          title="Generate Video"
        />
        <ActionCard
          href="/dashboard/ghibli_image_generator"
          icon={<FiImage />}
          title="Ghibli Image Generator"
        />
        <ActionCard
          href="/dashboard/generate_svg"
          icon={<FiImage />}
          title="SVG Generator"
        />
      </div>
    </motion.div>
  );
}

const ActionCard = ({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) => (
  <Link href={href}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 p-6 rounded-lg shadow-md text-center space-y-3 hover:bg-gray-700 transition"
    >
      <div className="text-3xl">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </motion.div>
  </Link>
);
