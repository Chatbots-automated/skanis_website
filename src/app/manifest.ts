import type { MetadataRoute } from "next";
import { defaultDescription } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} – maisto sudėties gidas`,
    short_name: SITE_NAME,
    description: defaultDescription,
    lang: "lt",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
