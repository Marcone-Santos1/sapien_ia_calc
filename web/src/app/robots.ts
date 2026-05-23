import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/privacy", "/login", "/blog", "/blog/"],
      disallow: ["/dashboard", "/api/"],
    },
    sitemap: "https://sapienia.calculadoraunivesp.com.br/sitemap.xml",
  };
}
