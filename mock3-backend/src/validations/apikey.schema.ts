import { z } from "zod";

export const createApiKeySchema = z.object({
  name: z
    .string()
    .max(255, "Name must be at most 255 characters")
    .optional()
    .default(""),
  expiresInHours: z
    .number()
    .int()
    .min(1, "Must be at least 1 hour")
    .max(8760, "Max 1 year")
    .optional(),
});

export const regenerateApiKeyParamsSchema = z.object({
  id: z.string().uuid("Invalid API key ID"),
});

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type RegenerateApiKeyParams = z.infer<typeof regenerateApiKeyParamsSchema>;
