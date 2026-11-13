export const categories = {
  reviews: { name: "Reviews", description: "Honest looks at popular biotin shampoos." },
  benefit: { name: "Benefits", description: "What biotin can and can't do for your hair." },
  "where-to-buy": { name: "Where to Buy", description: "How to shop for biotin hair products safely." },
  "biotin-hair": { name: "Biotin & Hair", description: "Supplements, science and everyday hair care." },
} as const;

export type CategorySlug = keyof typeof categories;
export const isCategory = (s: string): s is CategorySlug => s in categories;
