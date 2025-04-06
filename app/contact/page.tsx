"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    emailjs
      .sendForm(
        "service_kpcohdb", // ✅ Your SMTP service ID
        "template_yvyts2y", // ✅ Your EmailJS template ID
        formRef.current,
        "aZOm9xi3L6TCsxSoc" // ✅ Your public key
      )
      .then(
        () => {
          setSent(true);
          setError("");
          formRef.current?.reset();
        },
        (error) => {
          setSent(false);
          setError("❌ Failed to send message. Please try again later.");
          console.error("Email failed...", error.text);
        }
      );
  };

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
          Get in Touch
        </motion.h1>
        <p className="text-lg text-gray-200 text-center max-w-2xl mx-auto mb-16">
          We'd love to hear from you! Whether you have a question, feedback, or
          a collaboration idea—drop us a message.
        </p>

        <motion.form
          ref={formRef}
          onSubmit={sendEmail}
          className="bg-white/10 backdrop-blur-md max-w-2xl mx-auto p-8 rounded-xl shadow-lg space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="user_name"
              required
              className="w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 ring-white/40 placeholder:text-gray-300"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="user_email"
              required
              className="w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 ring-white/40 placeholder:text-gray-300"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Message</label>
            <textarea
              rows={5}
              name="user_message"
              required
              className="w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 ring-white/40 placeholder:text-gray-300"
              placeholder="Your message..."
            />
          </div>
          <button
            type="submit"
            className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-all"
          >
            Send Message
          </button>

          {sent && (
            <p className="text-green-300 mt-4">
              ✅ Your message has been sent. We'll get back to you soon!
            </p>
          )}
          {error && <p className="text-red-300 mt-4">{error}</p>}
        </motion.form>
      </section>

      <footer className="mt-24 py-6 text-center bg-white/10 backdrop-blur-md">
        <p className="text-gray-300">
          &copy; 2025 AI Generator. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
