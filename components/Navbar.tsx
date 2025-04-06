"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      className="w-full px-6 md:px-12 py-4 bg-white/10 backdrop-blur-md shadow-md fixed top-0 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-white">
          LuminAI
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/features">Features</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:block">
          {!isSignedIn ? (
            <SignInButton>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition">
                Sign In
              </Button>
            </SignInButton>
          ) : (
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Dashboard
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white text-2xl"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          className="md:hidden flex flex-col items-center space-y-6 mt-4 bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <NavLink href="/">Home</NavLink>
          <NavLink href="/features">Features</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/contact">Contact</NavLink>

          {!isSignedIn ? (
            <SignInButton>
              <Button
                variant="outline"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition w-full"
              >
                Sign In
              </Button>
            </SignInButton>
          ) : (
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition w-full"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Dashboard
            </Button>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}

// Navigation Link Component
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="text-white text-lg font-medium hover:text-gray-300 transition"
  >
    {children}
  </a>
);
