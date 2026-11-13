import type { NextConfig } from "next";

// Old WordPress URLs -> new slugs, so existing links and search rankings carry over.
const legacy: Record<string, string> = {
  // 2022 dated permalinks and the old short URLs
  "/2022/02/08/benefits-of-biotin-shampoo": "/benefits-of-biotin-shampoo",
  "/2022/02/17/side-effects-of-biotin-shampoo": "/side-effects-of-biotin-shampoo",
  "/2022/02/19/where-to-buy-biotin-shampoo": "/where-to-buy-biotin-shampoo-for-hair",
  "/where-to-buy-biotin-shampoo": "/where-to-buy-biotin-shampoo-for-hair",
  "/2022/02/20/ogx-biotin-shampoo-review": "/ogx-biotin-shampoo-reviews",
  "/ogx-biotin-shampoo-review": "/ogx-biotin-shampoo-reviews",
  "/2022/02/22/dallas-biotin-thickening-shampoo": "/dallas-shampoo",
  "/dallas-biotin-thickening-shampoo": "/dallas-shampoo",
  "/2022/02/22/briogeo-shampoo-biotin-ginseng": "/briogeo-shampoo-ginseng",
  "/2022/02/24/difeel-ultra-growth-review": "/difeel-ultra-growth-reviews",
  "/difeel-ultra-growth-review": "/difeel-ultra-growth-reviews",
  "/2022/03/01/hask-shampoo": "/hask-shampoo-secret",
  "/hask-shampoo": "/hask-shampoo-secret",
  "/2022/03/03/renpure-shampoo-review": "/renpure-shampoo-reviews",
  "/renpure-shampoo-review": "/renpure-shampoo-reviews",
  "/2022/03/05/reline-biotin-shampoo": "/reline-biotin-shampoo-for-hair",
  "/reline-biotin-shampoo": "/reline-biotin-shampoo-for-hair",
  "/2022/03/08/honeydew-biotin-shampoo": "/honeydew-biotin-shampooeffect",
  "/honeydew-biotin-shampoo": "/honeydew-biotin-shampooeffect",
  "/2022/04/02/hair-growth-tips": "/hair-growth-tips",
  // 2026 dated permalinks (including the duplicate -2/-3 copies)
  "/2026/04/20/what-to-look-for-in-a-biotin-shampoo-before-you-buy": "/what-to-look-for-in-a-biotin-shampoo-before-you-buy",
  "/2026/04/24/does-biotin-shampoo-work": "/does-biotin-shampoo-work",
  "/2026/07/21/does-biotin-shampoo-actually-work-heres": "/does-biotin-shampoo-work",
  "/2026/07/22/does-biotin-shampoo-actually-work-heres-2": "/does-biotin-shampoo-work",
  "/2026/07/22/does-biotin-shampoo-actually-work-heres-3": "/does-biotin-shampoo-work",
  "/2026/07/22/what-to-look-for-in-a-biotin-shampoo-2026": "/what-to-look-for-in-a-biotin-shampoo-before-you-buy",
  "/2026/07/22/what-to-look-for-in-a-biotin-shampoo-2026-2": "/what-to-look-for-in-a-biotin-shampoo-before-you-buy",
  "/2026/07/22/where-to-buy-biotin-shampoo-for-2026": "/where-to-buy-biotin-shampoo-for-hair",
  "/2026/07/22/review-ogx-biotin-shampoo-with-collagen": "/ogx-biotin-shampoo-reviews",
  "/2026/07/22/review-dallas-biotin-thickening-shampoo-for": "/dallas-shampoo",
  "/2026/07/22/review-what-briogeo-shampoo-can-offer": "/briogeo-shampoo-ginseng",
  "/2026/07/22/review-difeel-ultra-growth-shampoo-solution": "/difeel-ultra-growth-reviews",
  "/2026/07/22/review-hask-shampoo-secret-ingredients-for": "/hask-shampoo-secret",
  "/2026/07/22/review-renpure-shampoo-tested-and-trusted": "/renpure-shampoo-reviews",
  "/2026/07/22/review-reline-biotin-shampoo-special-2026": "/reline-biotin-shampoo-for-hair",
  "/2026/07/22/review-reline-biotin-shampoo-special-2026-2": "/reline-biotin-shampoo-for-hair",
  "/2026/07/22/review-honeydew-biotin-shampoo-effects-for": "/honeydew-biotin-shampooeffect",
  "/2026/07/22/honeydew-biotin-shampoo-review-effects-tips": "/honeydew-biotin-shampooeffect",
  "/2026/07/22/hair-growth-tips-how-biotin-shampoo-2026": "/hair-growth-tips",
  "/2026/07/22/hair-growth-tips-how-biotin-shampoo-2026-2": "/hair-growth-tips",
  "/2026/07/24/best-biotin-supplement-for-hair-growth-2": "/best-biotin-supplement-for-hair-growth-2",
  // Old category and page URLs
  "/reviews": "/category/reviews",
  "/benefit": "/category/benefit",
  "/where-to-buy": "/category/where-to-buy",
  "/biotin-hair": "/category/biotin-hair",
  "/general": "/blog",
  "/uncategorized": "/blog",
  "/home": "/category/reviews",
};

const nextConfig: NextConfig = {
  trailingSlash: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      ...Object.entries(legacy).map(([source, destination]) => ({ source, destination, permanent: true })),
      { source: "/tag/:tag", destination: "/blog", permanent: true },
      { source: "/wp-content/uploads/:path*", destination: "/uploads/:path*", permanent: true },
      // Anything that looks like the old WordPress/PHP surface goes home instead of 404ing bots into logs.
      { source: "/:path*.php", destination: "/", permanent: false },
      { source: "/wp-admin/:path*", destination: "/admin", permanent: false },
    ];
  },
};

export default nextConfig;
