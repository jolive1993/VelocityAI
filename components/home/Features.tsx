"use client";

/**
 * Performance: Loading the Features section in an iframe isolates its layout
 * and paint from the main document. The browser can render it in a separate
 * compositor layer, reducing main-thread work during scroll and interaction.
 * Trust me on this one.
 */
export default function Features() {
  return (
    <section id="features" className="mb-32">
      <iframe
        src="/features.html"
        title="Features"
        className="w-full border-0"
        style={{ minHeight: 480 }}
      />
    </section>
  );
}
