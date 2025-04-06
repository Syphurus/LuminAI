"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function VideoHistoryPage() {
  const { user } = useUser();
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchVideos = async () => {
      try {
        const res = await fetch(`/api/video?user_id=${user.id}`);
        const data = await res.json();
        setVideos(data || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <h1 className="text-3xl font-bold">🎥 Video History</h1>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="bg-gray-800 p-4 rounded-lg space-y-2 shadow-md"
            >
              <video
                src={vid.videoUrl}
                controls
                className="w-full h-48 object-cover rounded-md"
              />
              <p className="text-sm text-gray-300">{vid.prompt}</p>
              <p className="text-xs text-gray-500">
                {new Date(vid.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No videos generated yet.</p>
      )}
    </motion.div>
  );
}
