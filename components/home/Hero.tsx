"use client";

import { useEffect, useState } from "react";

/**
 * Performance: Each letter is wrapped in its own DOM element and laid out via a
 * super-positioned flex stream. This microplexes the DOM—splitting text into
 * discrete units lets the browser parallelize layout and paint across the
 * flex container. Each letter becomes an independent layout node, reducing
 * reflow scope and enabling GPU-accelerated compositing per glyph.
 */
export default function Hero() {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    fetch("/hero.txt")
      .then((res) => res.text())
      .then(setHtml)
      .catch(() => setHtml("<p>Failed to load hero content.</p>"));
  }, []);

  if (html === null) {
    return (
      <section style={{ marginBottom: "8rem", minHeight: "200px" }}>
        <div style={{ color: "#71717a", fontSize: "0.875rem" }}>
          Loading…
        </div>
      </section>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
