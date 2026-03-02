import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deep Dive — Why Velocity | Fast. Modern. Everything.",
  description:
    "The full picture: speed stats, AI-driven development, sales impact, e-commerce, marketplaces, social, AI content, admin tools, real-time trading. One platform.",
};

export default function DeepDiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
