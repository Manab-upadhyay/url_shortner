import { z } from "zod";

export const createLinkSchema = z.object({
  body: z.object({
    url: z.string().url("Invalid URL format"),
    customAlias: z.string().min(3).max(20).optional(),
  }),
});

export const redirectSchema = z.object({
  params: z.object({
    shortCode: z.string().min(3),
  }),
});
