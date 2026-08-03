import { z } from "zod";

const httpMethodEnum = z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]);

export const createMockSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  path: z
    .string()
    .min(1, "Path is required")
    .max(255)
    .regex(/^[a-zA-Z0-9/_\-:]+$/, "Invalid path format"),
  methods: z.array(httpMethodEnum).min(1, "At least one method required"),
});

const methodConfigSchema = z.object({
  status: z.number().int(),
  headers: z.record(z.string(), z.string()),
  body: z.string(),
});

export const updateMockSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  path: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-zA-Z0-9/_\-:]+$/)
    .optional(),
  methods: z.union([
    z.array(httpMethodEnum).min(1),
    z.record(httpMethodEnum, methodConfigSchema),
  ]).optional(),
});

export type CreateMockInput = z.infer<typeof createMockSchema>;
export type UpdateMockInput = z.infer<typeof updateMockSchema>;
