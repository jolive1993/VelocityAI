import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account — Velocity",
  description: "Manage your profile",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
