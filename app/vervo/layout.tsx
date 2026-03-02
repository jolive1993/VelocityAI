import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vervo — Velocity AI Assistant",
  description:
    "Interact with Vervo, Velocity's revolutionary AI assistant. Powered by advanced reasoning and stochastic latent projection.",
};

export default function VervoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
