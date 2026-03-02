import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register — Velocity",
  description: "Create an account",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
