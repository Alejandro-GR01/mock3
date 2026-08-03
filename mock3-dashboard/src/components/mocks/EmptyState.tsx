import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export default function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Card className="rounded-none border-border-strong shadow-none bg-gradient-to-t from-primary/5 to-card mx-auto max-w-md">
         <CardContent className="flex flex-col items-center justify-center p-12">
           <picture>
             <source type="image/webp" srcSet="/mocky-happy.webp" />
             <img
               src="/mocky-happy.png"
               alt="Mocky happy and ready"
               width={160}
               height={160}
               className="object-contain"
             />
           </picture>
          <h2 className="mt-6 text-[16px] font-semibold text-text-primary">
            No mocks yet
          </h2>
          <p className="mt-2 text-[13px] text-brand-gold">
            Mocky is ready to mock!
          </p>
          <button
            type="button"
            onClick={onCreateClick}
            className="mt-6 rounded-none bg-accent-blue px-4 py-2 text-[13px] font-medium text-white hover:opacity-90 transition-opacity"
          >
            Create Mock
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
