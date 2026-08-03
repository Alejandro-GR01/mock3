import { z } from "zod";

export const createMockSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  path: z
    .string()
    .min(1, "Path is required")
    .max(255)
    .regex(/^[a-zA-Z0-9/_\-:]+$/, "Path can only contain letters, numbers, /, -, _, and :"),
  methods: z
    .array(z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]))
    .min(1, "At least one method is required"),
});

export type CreateMockInput = z.infer<typeof createMockSchema>;
