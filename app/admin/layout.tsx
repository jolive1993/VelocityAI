import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Velocity",
  description: "Admin dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
