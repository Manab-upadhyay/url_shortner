import { z } from "zod";

export const createLinkSchema = z.object({
  body: z.object({
    url: z.string().url("Invalid URL format"),
    customAlias: z.string().min(3).max(20).optional(),
    name: z.string().min(1, "Name is required"),
  }),
});

export const redirectSchema = z.object({
  params: z.object({
    shortCode: z.string().min(3),
  }),
});
