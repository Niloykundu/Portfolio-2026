import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  projectType: z.string().optional(),
  budget: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1).max(200),
  editorName: z.string().min(1).max(200),
  headline: z.string().min(1),
  subheadline: z.string().optional().nullable(),
  ctaPrimaryText: z.string().optional(),
  ctaSecondaryText: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  availabilityStatus: z.boolean(),
  availabilityText: z.string().optional(),
  footerText: z.string().optional().nullable(),
  contactHeadline: z.string().optional(),
  contactCtaText: z.string().optional(),
  calendlyUrl: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  heroImageUrl: z.string().optional().nullable(),
  heroImagePublicId: z.string().optional().nullable(),
  heroVideoUrl: z.string().optional().nullable(),
  heroVideoPublicId: z.string().optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  sortOrder: z.number().int().default(0),
});

export const serviceSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const softwareSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  logoPublicId: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1).max(50),
  label: z.string().min(1).max(100),
  url: z.string().url("Please enter a valid URL"),
  sortOrder: z.number().int().default(0),
});

export const aboutSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  profileImageUrl: z.string().url().optional().nullable(),
  profileImagePublicId: z.string().optional().nullable(),
  yearsExperience: z.number().int().min(0),
  projectsCompleted: z.number().int().min(0),
  clientsCount: z.number().int().min(0),
  toolsCount: z.number().int().min(0),
});
