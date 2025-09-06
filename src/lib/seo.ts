import { SITE, absoluteUrl } from './site';

export type JsonLD = Record<string, any>;

export function organizationJsonLd(): JsonLD {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl(SITE.logo),
  };
}

export function breadcrumbJsonLd(segments: { name: string; url: string }[]): JsonLD {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.name,
      item: absoluteUrl(s.url),
    })),
  };
}

export function serviceJsonLd({ name, description, url = '/services' }: { name: string; description: string; url?: string }): JsonLD {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    url: absoluteUrl(url),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]): JsonLD {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: { '@type': 'Answer', text: qa.answer },
    })),
  };
}

export function articleJsonLd({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  image = '/og/default.svg',
}: {
  title: string;
  description?: string;
  slug: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}): JsonLD {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: absoluteUrl(image),
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: absoluteUrl(SITE.logo) } },
    mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
  };
}

export function buildMeta({
  title = SITE.name,
  description = SITE.description,
  path = '/',
  image = '/og/default.svg',
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}) {
  const url = absoluteUrl(path);
  const img = absoluteUrl(image);
  return {
    title,
    description,
    og: {
      title,
      description,
      type: 'website',
      url,
      image: img,
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE.twitter,
      title,
      description,
      image: img,
    },
  } as const;
}
