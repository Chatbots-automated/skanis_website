import type { Metadata } from "next";

/**
 * Only the production deploy may be indexed. Netlify sets CONTEXT to
 * "production" | "deploy-preview" | "branch-deploy" at build time, so preview
 * URLs never compete with the real site in Google. SITE_INDEXING=true forces
 * it on for other hosts.
 */
export const indexable = process.env.CONTEXT === "production" || process.env.SITE_INDEXING === "true";

export const defaultTitle = "Skanis – maisto sudėtis aiškiau iš pirmo žvilgsnio";
export const defaultDescription =
  "Skanis padeda greičiau pastebėti tau svarbius alergenus maisto produktų sudėtyje. Nufotografuok etiketę, peržiūrėk ingredientus ir užsiregistruok pirmajam testavimui.";

/** Per-page metadata with a canonical URL and matching Open Graph fields. */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

/** Pages listed in sitemap.xml. */
export const sitemapPaths = ["/", "/privatumo-politika", "/naudojimo-salygos", "/duomenu-istrynimas"] as const;
