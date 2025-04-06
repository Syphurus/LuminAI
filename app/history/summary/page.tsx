"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2, FiCopy } from "react-icons/fi";

export default function SummaryHistoryPage() {
  const { user } = useUser();
  const [summaries, setSummaries] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const fetchSummaries = async () => {
      try {
        const res = await fetch(`/api/summarize?user_id=${user.id}`);
        const data = await res.json();
        setSummaries(data || []);
      } catch (error) {
        console.error("Error fetching summaries:", error);
      }
    };

    fetchSummaries();
  }, [user]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/summarize/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setSummaries((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleEdit = async (id: string) => {
    const res = await fetch(`/api/summarize/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary: editedText }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSummaries((prev) =>
        prev.map((s) => (s.id === id ? { ...s, summary: updated.summary } : s))
      );
      setEditingId(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <h1 className="text-3xl font-bold">📝 Summary History</h1>
      {summaries.length > 0 ? (
        <div className="space-y-4">
          {summaries.map((summary) => (
            <div
              key={summary.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md space-y-2"
            >
              {editingId === summary.id ? (
                <>
                  <textarea
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    rows={4}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-green-600 px-3 py-1 rounded"
                      onClick={() => handleEdit(summary.id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-600 px-3 py-1 rounded"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-300">{summary.summary}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      {new Date(summary.createdAt).toLocaleString()}
                    </p>
                    <div className="flex gap-3 text-gray-400">
                      <FiCopy
                        className="cursor-pointer hover:text-white"
                        onClick={() => handleCopy(summary.summary)}
                      />
                      <FiEdit
                        className="cursor-pointer hover:text-white"
                        onClick={() => {
                          setEditingId(summary.id);
                          setEditedText(summary.summary);
                        }}
                      />
                      <FiTrash2
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => handleDelete(summary.id)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No summaries generated yet.</p>
      )}
    </motion.div>
  );
}
