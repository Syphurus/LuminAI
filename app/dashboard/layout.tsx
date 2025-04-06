// app/dashboard/layout.tsx
"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  FiLogOut,
  FiImage,
  FiVideo,
  FiFileText,
  FiClock,
} from "react-icons/fi";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 space-y-6 shadow-lg hidden md:block">
        <h2 className="text-2xl font-bold">AI Generator</h2>
        <nav className="space-y-4">
          <NavItem
            href="/dashboard/summarize"
            icon={<FiFileText />}
            label="Summarize Text"
          />
          <NavItem
            href="/dashboard/generate-image"
            icon={<FiImage />}
            label="Generate Image"
          />
          <NavItem
            href="/dashboard/generate-video"
            icon={<FiVideo />}
            label="Generate Video"
          />
          <NavItem
            href="/dashboard/ghibli_image_generator"
            icon={<FiImage />}
            label="Ghibli Image Generator"
          />
          <NavItem
            href="/dashboard/generate_svg"
            icon={<FiImage />}
            label="SVG Generator"
          />
          <NavItem href="/history/image" icon={<FiClock />} label="History" />
        </nav>
        <SignOutButton>
          <Button className="bg-red-500 hover:bg-red-600 w-full flex items-center gap-2">
            <FiLogOut />
            Sign Out
          </Button>
        </SignOutButton>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}

const NavItem = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <Link
    href={href}
    className="flex items-center gap-3 text-gray-300 hover:text-white transition"
  >
    {icon}
    {label}
  </Link>
);
