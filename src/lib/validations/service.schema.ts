import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  category: z.string().min(2),
  images: z.array(z.string().url()).optional(),
  isAvailable: z.boolean().default(true),
});

export const serviceUpdateSchema = serviceSchema.partial();

export type ServiceInput = z.infer<typeof serviceSchema>;
