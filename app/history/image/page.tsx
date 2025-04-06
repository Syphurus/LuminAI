"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiEdit2, FiCopy, FiSave } from "react-icons/fi";

export default function ImageHistoryPage() {
  const { user } = useUser();
  const [images, setImages] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState("");

  const backendUrl = "http://localhost:8001"; // Update if using Docker with a different service name

  useEffect(() => {
    if (!user?.id) return;

    const fetchImages = async () => {
      try {
        const res = await fetch(`/api/image?user_id=${user.id}`);
        const data = await res.json();
        console.log("Fetched image data:", data); // Debug
        setImages(data || []);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/image/${id}`, { method: "DELETE" });
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(`${backendUrl}${url}`);
    alert("Image URL copied to clipboard!");
  };

  const handleEdit = async (id: string) => {
    try {
      await fetch(`/api/image/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: editPrompt }),
      });

      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, prompt: editPrompt } : img
        )
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
      className="max-w-6xl mx-auto space-y-6"
    >
      <h1 className="text-3xl font-bold">🖼️ Image History</h1>
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-gray-800 p-4 rounded-lg space-y-2 shadow-md relative"
            >
              <img
                src={
                  img.imageUrl.startsWith("http")
                    ? img.imageUrl
                    : `${backendUrl}${img.imageUrl}`
                }
                alt={img.prompt}
                className="w-full h-48 object-cover rounded-md"
              />
              {editingId === img.id ? (
                <input
                  type="text"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white text-sm"
                />
              ) : (
                <p className="text-sm text-gray-300">{img.prompt}</p>
              )}
              <p className="text-xs text-gray-500">
                {new Date(img.createdAt).toLocaleString()}
              </p>

              <div className="flex justify-end gap-3 pt-2">
                {editingId === img.id ? (
                  <button
                    onClick={() => handleEdit(img.id)}
                    className="text-blue-400 text-sm flex items-center gap-1"
                  >
                    <FiSave /> Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(img.id);
                      setEditPrompt(img.prompt);
                    }}
                    className="text-yellow-400"
                    title="Edit Prompt"
                  >
                    <FiEdit2 />
                  </button>
                )}
                <button
                  onClick={() => handleCopy(img.imageUrl)}
                  className="text-green-400"
                  title="Copy URL"
                >
                  <FiCopy />
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="text-red-500"
                  title="Delete Image"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No images generated yet.</p>
      )}
    </motion.div>
  );
}
