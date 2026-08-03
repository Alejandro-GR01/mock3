import type { UseFormReturn } from "react-hook-form";
import type { CreateMockInput } from "@/validations/mock.schema";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

interface MockFormProps {
  form: UseFormReturn<CreateMockInput>;
  onSubmit: (data: CreateMockInput) => void;
  submitLabel: string;
  isSubmitting?: boolean;
}

export default function MockForm({
  form,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: MockFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onValid = (data: CreateMockInput) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="mock-name"
          className="text-[12px] font-medium text-text-secondary uppercase tracking-wide"
        >
          Name
        </label>
        <input
          id="mock-name"
          type="text"
          placeholder="e.g. User API"
          {...register("name")}
          className="rounded-none border border-border-strong bg-bg-terminal px-3 py-2 text-[13px] text-text-primary placeholder:text-text-secondary outline-none focus:border-accent-blue transition-colors"
        />
        {errors.name && (
          <p className="text-[11px] text-state-error">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="mock-path"
          className="text-[12px] font-medium text-text-secondary uppercase tracking-wide"
        >
          Path
        </label>
        <div className="flex items-center rounded-none border border-border-strong bg-bg-terminal">
          <span className="pl-3 pr-1 font-mono text-[13px] text-text-secondary">
            /
          </span>
          <input
            id="mock-path"
            type="text"
            placeholder="e.g. users/:id"
            {...register("path")}
            className="w-full bg-transparent py-2 pr-3 font-mono text-[13px] text-text-primary placeholder:text-text-secondary outline-none"
          />
        </div>
        {errors.path && (
          <p className="text-[11px] text-state-error">{errors.path.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-medium text-text-secondary uppercase tracking-wide">
          Methods
        </span>
        <div className="flex flex-wrap gap-2">
          {HTTP_METHODS.map((method) => (
            <label
              key={method}
              className="flex items-center gap-2 rounded-none border border-border-strong bg-bg-terminal px-3 py-2 text-[13px] cursor-pointer hover:bg-bg-editor transition-colors has-[:checked]:border-accent-blue has-[:checked]:bg-accent-blue/10"
            >
              <input
                type="checkbox"
                value={method}
                {...register("methods")}
                className="sr-only"
              />
              <span className="font-mono text-[11px] font-bold uppercase text-text-secondary">
                {method}
              </span>
            </label>
          ))}
        </div>
        {errors.methods && (
          <p className="text-[11px] text-state-error">
            {errors.methods.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-none bg-accent-blue px-4 py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
