import type {LoadingModalProps} from '../../../domain/types/ui';

export const LoadingModal: React.FC<LoadingModalProps> = ({show}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-200/70 backdrop-blur-sm">
      <div className="flex w-full max-w-xs flex-col items-center rounded-xl bg-white/90 px-6 py-4 shadow-2xl">
        <svg className="h-16 w-16 animate-spin text-brand-sky-text" viewBox="0 0 50 50">
          <circle
            className="opacity-25"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M25 5a20 20 0 0 1 20 20h-6a14 14 0 1 0-14 14v6A20 20 0 0 1 25 5z"
          />
        </svg>
        <span className="mt-4 animate-pulse text-xl font-bold text-brand-ink">Cargando...</span>
      </div>
    </div>
  );
};
