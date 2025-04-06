"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FiClipboard, FiDownload, FiLoader } from "react-icons/fi";

export default function SummarizePage() {
  const { userId } = useAuth();
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null; // Prevent hydration mismatch

  const handleSummarize = async () => {
    if (!inputText.trim() || !userId) return;

    setLoading(true);
    setSummary("");

    try {
      // Use NEXT_PUBLIC_API_URL or fallback to localhost
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send prompt and user_id as expected by the backend
        body: JSON.stringify({ prompt: inputText, user_id: userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
      } else {
        setSummary("Error: " + (data.detail || "Failed to summarize"));
      }
    } catch (error) {
      console.error("Error:", error);
      setSummary("Failed to summarize. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadSummary = (text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white flex flex-col items-center">
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Summarize Text with AI
      </motion.h1>

      {/* Input Text Area */}
      <textarea
        className="w-full max-w-3xl p-4 bg-gray-800 rounded-lg text-white text-lg focus:outline-none"
        rows={6}
        placeholder="Paste your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      {/* Generate Button */}
      <Button
        onClick={handleSummarize}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg transition flex items-center gap-2"
        disabled={loading}
      >
        {loading ? <FiLoader className="animate-spin" /> : "Generate Summary"}
      </Button>

      {/* Summary Display */}
      {summary && (
        <motion.div
          className="mt-6 w-full max-w-3xl bg-gray-800 p-4 rounded-lg text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-2">AI Summary:</h3>
          <p className="text-gray-300">{summary}</p>

          {/* Action Buttons */}
          <div className="flex mt-4 gap-4">
            <Button
              onClick={() => navigator.clipboard.writeText(summary)}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              <FiClipboard />
              Copy
            </Button>
            <Button
              onClick={() => downloadSummary(summary)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              <FiDownload />
              Download
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
