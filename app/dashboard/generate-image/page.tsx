"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FiImage, FiLoader, FiDownload, FiCopy } from "react-icons/fi";

export default function GenerateImage() {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt.trim() || !userId) return;

    setLoading(true);
    setCopied(false);
    setImageUrl("");

    try {
      // Only call FastAPI, which also handles DB saving
      const response = await fetch("http://localhost:8001/api/generate_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, user_id: userId }),
      });

      if (!response.ok) {
        throw new Error("Image generation failed");
      }

      const data = await response.json();
      setImageUrl(data.image_url); // Use generated image URL from FastAPI
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "generated-image.png";
    a.click();
  };

  const handleCopy = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy image:", error);
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
        <h1 className="text-4xl font-bold">Generate AI Image</h1>
        <p className="text-gray-400 mt-2">
          Enter a prompt to generate an AI-powered image.
        </p>
      </motion.div>

      <div className="w-full max-w-2xl mt-6 space-y-4">
        <input
          type="text"
          className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-500 focus:ring focus:ring-blue-500"
          placeholder="Enter a description for your image..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2 justify-center"
          onClick={handleGenerateImage}
          disabled={loading}
        >
          {loading ? <FiLoader className="animate-spin" /> : <FiImage />}
          {loading ? "Generating..." : "Generate Image"}
        </Button>
      </div>

      {imageUrl && (
        <div className="mt-6 w-full max-w-2xl text-center">
          <h3 className="text-xl font-semibold mb-2">Generated Image</h3>
          <img
            src={imageUrl}
            alt="Generated"
            className="w-full rounded-lg shadow-lg"
          />

          <div className="flex gap-4 justify-center mt-4">
            <Button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <FiDownload />
              Download
            </Button>

            <Button
              onClick={handleCopy}
              className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-2"
            >
              <FiCopy />
              {copied ? "Copied!" : "Copy Image"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
