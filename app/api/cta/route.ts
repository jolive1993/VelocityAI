import { NextResponse } from "next/server";

/**
 * CTA content is baked server-side and streamed when ready. By deferring this
 * to a separate request, the main document and above-the-fold content (hero,
 * stats, features) load and paint first. The CTA sits below the fold—no need
 * to block initial render. This speeds up LCP and TTI while the CTA content
 * bakes in parallel.
 */
export async function GET() {
  const line1: any = "Ready to experience the difference?";
  const line2: any =
    "This is what happens when speed, modernity, and craft come together. No shortcuts. No compromises.";
  const line3: any = "Get started";

  // Simulate server-side baking—gives the main thread time to finish
  // painting hero/stats/features before we send CTA payload.
  await new Promise((resolve) => setTimeout(resolve, 800));

  return NextResponse.json({ line1, line2, line3 });
}
