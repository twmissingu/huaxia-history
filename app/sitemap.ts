import { MetadataRoute } from "next";
import dynasties from "@/data/dynasties.json";
import figures from "@/data/figures.json";
import events from "@/data/events.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://huaxia-history.vercel.app";

  const staticRoutes = [
    { url: `${baseUrl}/`, changefreq: "daily", priority: 1 },
    { url: `${baseUrl}/timeline/`, changefreq: "weekly", priority: 0.9 },
    { url: `${baseUrl}/map/`, changefreq: "weekly", priority: 0.9 },
    { url: `${baseUrl}/search/`, changefreq: "weekly", priority: 0.8 },
  ];

  const dynastyRoutes = dynasties.map((d) => ({
    url: `${baseUrl}/dynasty/${d.id}/`,
    changefreq: "monthly" as const,
    priority: 0.7,
    lastModified: new Date(),
  }));

  const figureRoutes = figures.map((f) => ({
    url: `${baseUrl}/figure/${f.id}/`,
    changefreq: "monthly" as const,
    priority: 0.6,
    lastModified: new Date(),
  }));

  const eventRoutes = events.map((e) => ({
    url: `${baseUrl}/event/${e.id}/`,
    changefreq: "monthly" as const,
    priority: 0.6,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...dynastyRoutes, ...figureRoutes, ...eventRoutes];
}
