// app/dashboard/history/layout.tsx
"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  FiLogOut,
  FiImage,
  FiVideo,
  FiFileText,
  FiArrowLeft,
} from "react-icons/fi";
import Link from "next/link";

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 space-y-6 shadow-lg hidden md:block">
        <h2 className="text-2xl font-bold">History</h2>
        <nav className="space-y-4">
          <SidebarLink
            href="/history/image"
            icon={<FiImage />}
            label="Image History"
          />
          <SidebarLink
            href="/history/video"
            icon={<FiVideo />}
            label="Video History"
          />
          <SidebarLink
            href="/history/summary"
            icon={<FiFileText />}
            label="Summary History"
          />
          <SidebarLink
            href="/history/ghibli"
            icon={<FiFileText />}
            label="Ghibli Image History"
          />
          <SidebarLink
            href="/history/SVG"
            icon={<FiFileText />}
            label="SVG History"
          />
          <SidebarLink
            href="/dashboard"
            icon={<FiArrowLeft />}
            label="Back to Dashboard"
          />
        </nav>
        <SignOutButton>
          <Button className="bg-red-500 hover:bg-red-600 w-full flex items-center gap-2 mt-4">
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

const SidebarLink = ({
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
