interface CarouselControlsProps {
  controlsId: string;
  previousLabel: string;
  nextLabel: string;
  previousDisabled: boolean;
  nextDisabled: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function CarouselControls(props: CarouselControlsProps) {
  const buttonClass =
    'pointer-events-auto flex h-12 w-11 shrink-0 items-center justify-center rounded-xl bg-transparent text-brand-ink/75 transition-[background-color,color] duration-200 enabled:hover:bg-white/30 enabled:hover:text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none sm:w-14';

  return (
    <div className="pointer-events-none relative z-30 flex items-center justify-center gap-12 sm:absolute sm:inset-x-0 sm:inset-y-0 sm:justify-between sm:gap-0">
      <button
        type="button"
        aria-controls={props.controlsId}
        aria-label={props.previousLabel}
        disabled={props.previousDisabled}
        onClick={props.onPrevious}
        className={buttonClass}
      >
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M18 7 9 16l9 9M9 16h17" stroke="currentColor" strokeWidth="1.5" />
          <path d="m10 10-4 6 4 6" stroke="currentColor" strokeWidth="1" opacity=".35" />
        </svg>
      </button>
      <button
        type="button"
        aria-controls={props.controlsId}
        aria-label={props.nextLabel}
        disabled={props.nextDisabled}
        onClick={props.onNext}
        className={buttonClass}
      >
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="m14 7 9 9-9 9m9-9H6" stroke="currentColor" strokeWidth="1.5" />
          <path d="m22 10 4 6-4 6" stroke="currentColor" strokeWidth="1" opacity=".35" />
        </svg>
      </button>
    </div>
  );
}
