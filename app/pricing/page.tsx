"use client";

import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";
import Navbar from "@/components/Navbar";

type Feature =
  | "Summarize Text"
  | "Generate Image"
  | "Generate Video"
  | "Ghibli Image Generator"
  | "SVG Generator";

type Plan = {
  name: string;
  price: string;
  features: Record<Feature, boolean>;
  button: string;
};

const allFeatures: Feature[] = [
  "Summarize Text",
  "Generate Image",
  "Generate Video",
  "Ghibli Image Generator",
  "SVG Generator",
];

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0/month",
    features: {
      "Summarize Text": true,
      "Generate Image": true,
      "Generate Video": false,
      "Ghibli Image Generator": false,
      "SVG Generator": false,
    },
    button: "Get Started",
  },
  {
    name: "Premium",
    price: "$9/month",
    features: {
      "Summarize Text": true,
      "Generate Image": true,
      "Generate Video": true,
      "Ghibli Image Generator": true,
      "SVG Generator": false,
    },
    button: "Upgrade",
  },
  {
    name: "Pro",
    price: "$19/month",
    features: {
      "Summarize Text": true,
      "Generate Image": true,
      "Generate Video": true,
      "Ghibli Image Generator": true,
      "SVG Generator": true,
    },
    button: "Go Pro",
  },
];

export default function PricingPage() {
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
          Choose Your Plan
        </motion.h1>
        <p className="text-lg text-gray-200 text-center max-w-2xl mx-auto mb-24">
          Whether you're just getting started or need full access to all our
          AI-powered tools, we've got a plan for you.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg text-center flex flex-col justify-between"
            >
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <p className="text-3xl font-semibold mb-6">{plan.price}</p>

              <ul className="text-left mb-6 space-y-3">
                {allFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    {plan.features[feature] ? (
                      <FaCheck className="text-green-400" />
                    ) : (
                      <FaTimes className="text-red-400" />
                    )}
                    <span
                      className={
                        plan.features[feature] ? "" : "line-through opacity-50"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-all">
                {plan.button}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="mt-24 py-6 text-center bg-white/10 backdrop-blur-md">
        <p className="text-gray-300">
          &copy; 2025 AI Generator. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
