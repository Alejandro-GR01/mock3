import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  createMockSchema,
  type CreateMockInput,
} from "@/validations/mock.schema";

export function useMockForm(defaultValues?: Partial<CreateMockInput>) {
  return useForm<CreateMockInput>({
    resolver: standardSchemaResolver(createMockSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: "",
      path: "",
      methods: ["GET"],
      ...defaultValues,
    },
  });
}
