import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    description: z.string().optional(),
    ogImage: z.string().optional(),
  })
});

const cases = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    industry: z.string().optional(),
    metrics: z.array(z.string()).default([]),
    anonymous: z.boolean().default(false),
    description: z.string().optional(),
  })
});

export const collections = { blog, cases };

