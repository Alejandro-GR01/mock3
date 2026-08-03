interface OfflineStateProps {
  onRetry?: () => void;
}

export default function OfflineState({ onRetry }: OfflineStateProps) {
  return (
    <div className="flex h-full items-center justify-center">
       <div className="flex flex-col items-center gap-4 p-8">
         <picture>
           <source type="image/webp" srcSet="/mocky-cables.webp" />
           <img
             src="/mocky-cables.png"
             alt="Mocky trying to fix the cables"
             width={200}
             height={200}
             className="object-contain"
           />
         </picture>
        <h2 className="text-lg font-semibold text-text-primary">
          Can&apos;t reach the server
        </h2>
        <p className="max-w-md text-center text-[13px] text-brand-gold">
          Mocky is trying to fix the cables...
        </p>
        <p className="max-w-md text-center text-[13px] text-text-muted">
          Backend unreachable. Check your connection and try again.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 text-[13px] text-white bg-accent-blue hover:bg-accent-blue/90"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
