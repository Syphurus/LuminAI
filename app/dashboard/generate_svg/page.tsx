"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FiLoader, FiCopy } from "react-icons/fi";

export default function SvgGenerator() {
  const { userId } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [svg, setSvg] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSvg = async () => {
    if (!prompt.trim() || !userId) return;
    setLoading(true);
    setSvg("");

    try {
      const res = await fetch("http://localhost:8004/generate-svg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, user_id: userId }),
      });
      const data = await res.json();
      setSvg(data.svg);
    } catch (err) {
      console.error("Error generating SVG:", err);
    }

    setLoading(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(svg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy SVG:", error);
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
        <h1 className="text-4xl font-bold mb-2">🎨 SVG Generator</h1>
        <p className="text-gray-400 mb-4">
          Enter a prompt to generate an SVG graphic.
        </p>
      </motion.div>

      <div className="w-full max-w-2xl space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your SVG..."
          className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700"
          rows={4}
        />

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
          onClick={generateSvg}
          disabled={loading}
        >
          {loading ? <FiLoader className="animate-spin" /> : "Generate SVG"}
        </Button>
      </div>

      {svg && (
        <motion.div
          className="mt-8 w-full max-w-2xl bg-white text-black p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-4 text-center">Rendered SVG</h3>
          <div
            className="flex justify-center items-center bg-gray-100 p-4 rounded"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <pre className="mt-4 text-sm bg-gray-200 p-3 rounded overflow-auto">
            {svg}
          </pre>

          <div className="flex justify-center mt-4">
            <Button
              onClick={handleCopy}
              className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-2"
            >
              <FiCopy />
              {copied ? "Copied!" : "Copy SVG Code"}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
