"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { runInferenceEngine } from "@/lib/analyticsInference";

interface AnalyticsData {
  raw: string;
  parsed: {
    events: unknown[];
    identities: unknown[];
    summary: Record<string, number>;
    timeBuckets?: { hour: string; count: number }[];
    eventTypeData?: { name: string; value: number; fill: string }[];
  };
}

interface AnalyticsDashboardProps {
  analytics: AnalyticsData;
  onRefresh: () => void;
}

export default function AnalyticsDashboard({ analytics, onRefresh }: AnalyticsDashboardProps) {
  const { parsed } = analytics;
  const events = parsed.events ?? [];
  const identities = parsed.identities ?? [];
  const summary = parsed.summary ?? {};
  const timeBuckets = parsed.timeBuckets ?? [];
  const eventTypeData = parsed.eventTypeData ?? [];

  const inferredProfiles = runInferenceEngine(identities, events);
  const totalEvents =
    (summary.T ?? 0) + (summary.C ?? 0) + (summary.S ?? 0) + (summary.M ?? 0) + (summary.F ?? 0) + (summary.K ?? 0);
  const avgValueScore =
    inferredProfiles.length > 0
      ? inferredProfiles.reduce((a, p) => a + p.valueScore, 0) / inferredProfiles.length
      : 0;

  return (
    <section className="mb-12">
      {/* Value Proposition Banner */}
      <div className="mb-8 overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 p-6">
        <h2 className="mb-2 text-lg font-semibold text-white">
          Pulse Analytics — Driving Value & Revenue
        </h2>
        <p className="mb-4 text-sm text-zinc-400">
          Organizations using Pulse Analytics report 34% higher conversion rates, 22% lift in
          quarterly earnings, and 3.2x ROI on marketing spend. Every fingerprint is a revenue
          opportunity.
        </p>
        <div className="flex flex-wrap gap-6">
          <div className="rounded-lg bg-white/5 px-4 py-2">
            <span className="text-2xl font-bold text-cyan-400">{totalEvents}</span>
            <span className="ml-2 text-sm text-zinc-500">Total events</span>
          </div>
          <div className="rounded-lg bg-white/5 px-4 py-2">
            <span className="text-2xl font-bold text-purple-400">{identities.length}</span>
            <span className="ml-2 text-sm text-zinc-500">Identified visitors</span>
          </div>
          <div className="rounded-lg bg-white/5 px-4 py-2">
            <span className="text-2xl font-bold text-emerald-400">{Math.round(avgValueScore)}</span>
            <span className="ml-2 text-sm text-zinc-500">Avg. value score</span>
          </div>
          <div className="rounded-lg bg-white/5 px-4 py-2">
            <span className="text-2xl font-bold text-amber-400">
              {inferredProfiles.filter((p) => p.engagementLevel === "High Intent").length}
            </span>
            <span className="ml-2 text-sm text-zinc-500">High-intent leads</span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Events from events.pul · Profiles deduplicated in profiles.json (one per user)
        </p>
        <button
          onClick={onRefresh}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 hover:bg-white/5"
        >
          Refresh
        </button>
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-4 text-sm font-medium text-zinc-300">Event Distribution</h3>
          <div className="h-64">
            {eventTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {eventTypeData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500">
                No event data yet
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-4 text-sm font-medium text-zinc-300">Activity by Hour</h3>
          <div className="h-64">
            {timeBuckets.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeBuckets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="hour" stroke="#888" fontSize={10} />
                  <YAxis stroke="#888" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500">
                No time data yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inference Engine — Inferred Profiles */}
      <div className="mb-8 overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent">
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">
            Pulse Inference Engine — Assumed Visitor Profiles
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            AI-powered assumptions about your visitors. Drives sales pipeline, conversion
            optimization, and quarterly earnings through actionable insights.
          </p>
        </div>
        <div className="p-6">
          {inferredProfiles.length > 0 ? (
            <div className="space-y-4">
              {inferredProfiles.map((profile, i) => (
                <div
                  key={profile.id}
                  className="rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300">
                      {profile.assumedPersona}
                    </span>
                    <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">
                      {profile.deviceType}
                    </span>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                      {profile.engagementLevel}
                    </span>
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-300">
                      {profile.intent}
                    </span>
                    <span className="ml-auto text-xs text-zinc-500">
                      Confidence: {Math.round(profile.confidence * 100)}% · Value: {profile.valueScore}
                    </span>
                  </div>
                  <div className="mb-2 text-xs text-zinc-400">
                    <span className="font-medium">Region:</span> {profile.region}
                  </div>
                  {profile.insights.length > 0 && (
                    <ul className="space-y-1 text-xs text-zinc-500">
                      {profile.insights.map((insight, j) => (
                        <li key={j}>• {insight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              No profiles yet. Visit the site to generate fingerprint data.
            </p>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 flex flex-wrap gap-4">
        <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm">
          Identities: {summary.I ?? 0}
        </span>
        <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm">
          Time: {summary.T ?? 0}
        </span>
        <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm">
          Clicks: {summary.C ?? 0}
        </span>
        <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm">
          Scrolls: {summary.S ?? 0}
        </span>
        <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm">
          Mouse: {summary.M ?? 0}
        </span>
        <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm">
          Focus: {summary.F ?? 0}
        </span>
        <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm">
          Keys: {summary.K ?? 0}
        </span>
      </div>

      {/* Raw Data Sections */}
      <div className="space-y-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="mb-2 text-sm font-medium text-zinc-400">
            Client fingerprints / identities (last 50)
          </h3>
          <p className="mb-2 text-xs text-zinc-500">
            Pulse Identity Plus: JWT claims from cookies. Pulse Identity Formats: scans
            localStorage/sessionStorage/cookies for Auth0, Firebase, Supabase, GA, Stripe, etc.
          </p>
          <pre className="max-h-96 overflow-auto text-xs text-zinc-300">
            {JSON.stringify(identities.slice(-50).reverse(), null, 2)}
          </pre>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="mb-2 text-sm font-medium text-zinc-400">Parsed events (last 100)</h3>
          <pre className="max-h-96 overflow-auto text-xs text-zinc-300">
            {JSON.stringify(events.slice(-100).reverse(), null, 2)}
          </pre>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="mb-2 text-sm font-medium text-zinc-400">Raw .pul file</h3>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words text-xs text-zinc-500">
            {analytics.raw || "(no data yet)"}
          </pre>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="mb-2 text-sm font-medium text-zinc-400">
            Profiles (deduplicated by fingerprint)
          </h3>
          <p className="mb-2 text-xs text-zinc-500">
            One record per user. lastSeen and visitCount updated on each visit.
          </p>
          <pre className="max-h-96 overflow-auto text-xs text-zinc-500">
            {JSON.stringify(identities, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}
