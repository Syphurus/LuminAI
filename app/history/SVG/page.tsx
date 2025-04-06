"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiEdit2, FiCopy, FiSave } from "react-icons/fi";

export default function SvgHistoryPage() {
  const { user } = useUser();
  const [svgs, setSvgs] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState("");

  const backendUrl = "http://localhost:8004"; // Or deployed URL

  useEffect(() => {
    if (!user?.id) return;

    const fetchSvgs = async () => {
      try {
        const res = await fetch(`${backendUrl}/svgs/${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) setSvgs(data);
      } catch (error) {
        console.error("Error fetching SVGs:", error);
      }
    };

    fetchSvgs();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${backendUrl}/svg/${id}`, { method: "DELETE" });
      setSvgs((prev) => prev.filter((svg) => svg.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleCopy = (svg: string) => {
    navigator.clipboard.writeText(svg);
    alert("SVG code copied to clipboard!");
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`${backendUrl}/svg/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: editPrompt }),
      });

      const updated = await res.json();
      setSvgs((prev) =>
        prev.map((svg) => (svg.id === id ? { ...svg, ...updated } : svg))
      );

      setEditingId(null);
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-6 p-4"
    >
      <h1 className="text-3xl font-bold">🖋️ SVG History</h1>
      {svgs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {svgs.map((svg) => (
            <div
              key={svg.id}
              className="bg-gray-800 p-4 rounded-lg space-y-2 shadow-md relative"
            >
              <div
                className="w-full h-48 overflow-hidden bg-white rounded-md"
                dangerouslySetInnerHTML={{ __html: svg.svg }}
              />
              {editingId === svg.id ? (
                <input
                  type="text"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white text-sm"
                />
              ) : (
                <p className="text-sm text-gray-300">{svg.prompt}</p>
              )}
              <p className="text-xs text-gray-500">
                {new Date(svg.createdAt).toLocaleString()}
              </p>

              <div className="flex justify-end gap-3 pt-2">
                {editingId === svg.id ? (
                  <button
                    onClick={() => handleEdit(svg.id)}
                    className="text-blue-400 text-sm flex items-center gap-1"
                  >
                    <FiSave /> Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(svg.id);
                      setEditPrompt(svg.prompt);
                    }}
                    className="text-yellow-400"
                    title="Edit Prompt"
                  >
                    <FiEdit2 />
                  </button>
                )}
                <button
                  onClick={() => handleCopy(svg.svg)}
                  className="text-green-400"
                  title="Copy SVG"
                >
                  <FiCopy />
                </button>
                <button
                  onClick={() => handleDelete(svg.id)}
                  className="text-red-500"
                  title="Delete SVG"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No SVGs generated yet.</p>
      )}
    </motion.div>
  );
}
