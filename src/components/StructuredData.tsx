import { FAQ } from "@/content/faq";
import { defaultDescription } from "@/lib/seo";
import { APP_STORE_URL, PLAY_STORE_URL, SITE_NAME, SITE_URL } from "@/lib/site";

/** schema.org data for the landing page: the organisation, the site, the app and the FAQ. */
export function StructuredData() {
  const stores = [APP_STORE_URL, PLAY_STORE_URL].filter(Boolean);
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      ...(stores.length && { sameAs: stores }),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "lt-LT",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "MobileApplication",
      name: SITE_NAME,
      description: defaultDescription,
      operatingSystem: "iOS, Android",
      applicationCategory: "HealthApplication",
      inLanguage: "lt-LT",
      publisher: { "@id": `${SITE_URL}/#organization` },
      ...(stores.length && { downloadUrl: stores, installUrl: stores }),
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  // JSON.stringify can't produce "</script>", but "<" is escaped anyway so the payload can never break out of the tag
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
