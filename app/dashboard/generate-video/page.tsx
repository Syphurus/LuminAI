"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FiUpload, FiVideo, FiLoader } from "react-icons/fi";

export default function GenerateVideo() {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [prompt, setPrompt] = useState("");

  // TODO: Replace with real user ID (from auth/session/localStorage/etc)
  const userId = "user_123"; // 🔁 Replace this line with real user ID fetching logic

  const handleGenerateVideo = async () => {
    if (!prompt.trim() || !userId) return;
    setLoading(true);

    try {
      const response = await fetch("/api/generate_video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, user_id: userId }), // ✅ Send user_id too
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Video generation failed");
      }

      const data = await response.json();
      setVideoUrl(data.video_url);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        <h1 className="text-4xl font-bold">Generate AI Video</h1>
        <p className="text-gray-400 mt-2">
          Enter a prompt to generate a short AI-powered video.
        </p>
      </motion.div>

      <div className="w-full max-w-2xl mt-6 space-y-4">
        <input
          type="text"
          className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-500 focus:ring focus:ring-blue-500"
          placeholder="Enter a description for your video..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2 justify-center"
          onClick={handleGenerateVideo}
          disabled={loading}
        >
          {loading ? <FiLoader className="animate-spin" /> : <FiVideo />}
          {loading ? "Generating..." : "Generate Video"}
        </Button>
      </div>

      {videoUrl && (
        <div className="mt-6 w-full max-w-2xl">
          <h3 className="text-xl font-semibold mb-2">Generated Video</h3>
          <video controls className="w-full rounded-lg shadow-lg">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
