import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

export const contactMessageSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: optionalString,
    message: z.string().min(10),
  }),
});
