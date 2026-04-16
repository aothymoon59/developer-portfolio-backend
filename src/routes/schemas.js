import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});

export const contactMessageSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().optional(),
    message: z.string().min(10)
  })
});

export const siteSettingSchema = z.object({
  body: z.object({
    siteTitle: z.string().min(2),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    aboutText: z.string().optional(),
    cvUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    facebookUrl: z.string().url().optional().or(z.literal('')),
    twitterUrl: z.string().url().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    location: z.string().optional()
  })
});

export const projectSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    slug: z.string().min(2),
    summary: z.string().min(10),
    description: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    liveUrl: z.string().url().optional().or(z.literal('')),
    repoUrl: z.string().url().optional().or(z.literal('')),
    featured: z.boolean().optional().default(false),
    sortOrder: z.number().int().optional().default(0),
    technology: z.array(z.string()).default([])
  })
});
