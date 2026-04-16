import { z } from "zod";

const optionalUrl = z.string().url().optional().or(z.literal(""));
const optionalString = z.string().optional().or(z.literal(""));
const stringArray = z.array(z.string().min(1)).optional().default([]);
const nullableDate = z.coerce.date().optional().nullable();

const linkItemSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const contactMessageSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: optionalString,
    message: z.string().min(10),
  }),
});

export const homeContentSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    jobTitle: z.string().min(2),
    homeDescription: z.string().min(10),
    heroTitle: optionalString,
    heroSubtitle: optionalString,
  }),
});

export const aboutContentSchema = z.object({
  body: z.object({
    aboutTitle: z.string().min(2),
    aboutDescription: z.string().min(10),
    aboutDetails: z.string().min(10).optional(),
    aboutImageUrl: optionalUrl,
    aboutImageLgUrl: optionalUrl,
    cvUrl: optionalUrl,
  }),
});

export const serviceSchema = z.object({
  body: z.object({
    imageUrl: optionalUrl,
    title: z.string().min(2),
    description: z.string().min(10),
    sortOrder: z.number().int().optional().default(0),
  }),
});

export const reviewSchema = z.object({
  body: z.object({
    review: z.string().min(10),
    rating: z.number().int().min(1).max(5),
    reviewerName: z.string().min(2),
    reviewerTitle: optionalString,
    officeName: optionalString,
    sortOrder: z.number().int().optional().default(0),
  }),
});

export const siteSettingSchema = z.object({
  body: z.object({
    siteTitle: z.string().min(2),
    logoUrl: optionalUrl,
    email: z.string().email().optional().or(z.literal("")),
    phone: optionalString,
    location: optionalString,
    contactDescription: optionalString,
    phoneNumbers: stringArray,
    emailAddresses: z.array(z.string().email()).optional().default([]),
    githubUrl: optionalUrl,
    linkedinUrl: optionalUrl,
    facebookUrl: optionalUrl,
    twitterUrl: optionalUrl,
    instagramUrl: optionalUrl,
    youtubeUrl: optionalUrl,
  }),
});

export const systemSettingSchema = z.object({
  body: z.object({
    cloudinaryCloudName: optionalString,
    cloudinaryApiKey: optionalString,
    cloudinaryApiSecret: optionalString,
    cloudinaryFolder: optionalString,
    smtpHost: optionalString,
    smtpPort: z.coerce.number().int().optional().nullable(),
    smtpSecure: z.coerce.boolean().optional().default(false),
    smtpUser: optionalString,
    smtpPass: optionalString,
    mailFrom: optionalString,
    adminNotificationEmail: z.string().email().optional().or(z.literal("")),
  }),
});

export const skillSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    category: optionalString,
    level: z.number().int().min(1).max(100).optional().nullable(),
    icon: optionalString,
    sortOrder: z.number().int().optional().default(0),
  }),
});

export const experienceSchema = z.object({
  body: z.object({
    company: z.string().min(2),
    position: z.string().min(2),
    startDate: z.coerce.date(),
    endDate: nullableDate,
    isCurrent: z.boolean().optional().default(false),
    description: z.string().min(10),
    technologies: stringArray,
    sortOrder: z.number().int().optional().default(0),
  }),
});

export const educationSchema = z.object({
  body: z.object({
    institute: z.string().min(2),
    degree: z.string().min(2),
    fieldOfStudy: optionalString,
    startDate: nullableDate,
    endDate: nullableDate,
    grade: optionalString,
    description: z.string().min(10),
    sortOrder: z.number().int().optional().default(0),
  }),
});

export const projectSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    slug: z.string().min(2),
    subTitle: z.string().min(2),
    summary: z.string().min(2).optional().or(z.literal("")),
    description: z.string().min(10),
    imageUrl: optionalUrl,
    liveUrl: optionalUrl,
    repoUrl: optionalUrl,
    frontendRepoUrl: optionalUrl,
    backendRepoUrl: optionalUrl,
    additionalLinks: z.array(linkItemSchema).optional().default([]),
    featured: z.boolean().optional().default(false),
    sortOrder: z.number().int().optional().default(0),
    technology: stringArray,
    skills: stringArray,
  }),
});

export const blogSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    slug: z.string().min(2),
    subTitle: z.string().min(2),
    excerpt: z.string().min(10),
    content: z.string().min(10),
    coverImage: optionalUrl,
    tags: stringArray,
    published: z.boolean().optional().default(false),
    publishedAt: nullableDate,
  }),
});
