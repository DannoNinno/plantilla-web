import {ArrowLeft, ArrowRight} from 'lucide-react';
import {clasesBoton} from '../Boton/estilos';

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
  return (
    <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 flex w-[86%] max-w-[26rem] -translate-x-1/2 items-center justify-between sm:w-[58%] lg:w-[40%]">
      <button
        type="button"
        aria-controls={props.controlsId}
        aria-label={props.previousLabel}
        disabled={props.previousDisabled}
        onClick={props.onPrevious}
        className={clasesBoton(
          'borde',
          'pointer-events-auto -ml-5 h-10 !min-h-10 w-10 shrink-0 !rounded-full bg-white/95 !p-2 shadow-sm',
        )}
      >
        <ArrowLeft size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-controls={props.controlsId}
        aria-label={props.nextLabel}
        disabled={props.nextDisabled}
        onClick={props.onNext}
        className={clasesBoton(
          'borde',
          'pointer-events-auto -mr-5 h-10 !min-h-10 w-10 shrink-0 !rounded-full bg-white/95 !p-2 shadow-sm',
        )}
      >
        <ArrowRight size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
