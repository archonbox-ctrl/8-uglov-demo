export interface EditorialCard {
  label?: string;
  title: string;
  text: string;
  href?: string;
}

export interface EditorialSection {
  eyebrow: string;
  title: string;
  anchor?: string;
  paragraphs: string[];
  cards?: EditorialCard[];
  catalogCategory?: string;
  variant?: "plain" | "cards" | "steps" | "highlight";
}

export interface CatalogVerification {
  status: string;
  /** Calendar date in YYYY-MM-DD format, or null when not confirmed. */
  checkedAt: string | null;
}

export interface ArticleMetadata {
  author?: { name: string; qualification?: string };
  /** Calendar dates in YYYY-MM-DD format. */
  publishedAt?: string;
  updatedAt?: string;
  sources?: { title: string; href: string }[];
}

export interface EditorialPageContent {
  route: string;
  category: string;
  title: string;
  description: string;
  heading: string;
  lead: string;
  verification?: CatalogVerification;
  article?: ArticleMetadata;
  sections: EditorialSection[];
  faq: { question: string; answer: string }[];
  related: { label: string; href: string }[];
}
