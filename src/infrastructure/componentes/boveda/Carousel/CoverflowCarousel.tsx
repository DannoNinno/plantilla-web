'use client';

import {useId, useRef} from 'react';
import type {ReactNode} from 'react';
import CarouselControls from './CarouselControls';
import {useCarousel} from './useCarousel';

export interface CarouselItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface CoverflowCarouselProps {
  items: CarouselItem[];
  labels: {
    title: string;
    carousel: string;
    slide: string;
    previous: string;
    next: string;
    help: string;
    selection: string;
    position: string;
  };
}

export default function CoverflowCarousel({items, labels}: CoverflowCarouselProps) {
  const id = useId();
  const region = useRef<HTMLDivElement>(null);
  const {activeIndex, previous, next, select, onKeyDown, swipeHandlers} = useCarousel(items.length);
  const position = labels.position
    .replace('{actual}', String(activeIndex + 1))
    .replace('{total}', String(items.length));

  function selectNeighbor(index: number) {
    select(index);
    region.current?.focus({preventScroll: true});
  }

  return (
    <div
      ref={region}
      role="region"
      aria-roledescription={labels.carousel}
      aria-label={labels.title}
      aria-describedby={`${id}-help`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="group/carrusel mt-6 min-w-0 focus:outline-none"
    >
      <p id={`${id}-help`} className="sr-only">
        {labels.help}
      </p>
      <div className="relative">
        <div
          id={id}
          {...swipeHandlers}
          className="isolate grid min-w-0 grid-cols-1 touch-pan-y items-stretch justify-items-center py-6 sm:mx-16 sm:overflow-hidden sm:py-8 sm:[mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)] lg:[mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]"
        >
          {items.map((item, index) => {
            const circularOffset = (index - activeIndex + items.length) % items.length;
            const offset =
              circularOffset > items.length / 2 ? circularOffset - items.length : circularOffset;
            const active = offset === 0;
            const neighbor = Math.abs(offset) === 1;
            const translation = active
              ? 'translate-x-0'
              : neighbor
                ? offset < 0
                  ? '-translate-x-[95%]'
                  : 'translate-x-[95%]'
                : offset < 0
                  ? '-translate-x-[190%]'
                  : 'translate-x-[190%]';
            return (
              <div
                key={item.id}
                id={`${id}-${item.id}`}
                role="group"
                aria-roledescription={labels.slide}
                aria-label={item.label}
                aria-hidden={!active && !neighbor ? true : undefined}
                inert={!active && !neighbor ? true : undefined}
                className={`relative col-start-1 row-start-1 w-full max-w-[30rem] transition-[transform,opacity,filter] duration-[400ms] ease-out motion-reduce:transition-none sm:w-[68%] lg:w-[48%] ${translation} ${
                  active
                    ? 'z-20 scale-100 opacity-100 blur-none motion-safe:max-sm:animate-intro'
                    : neighbor
                      ? 'hidden z-10 scale-[0.85] opacity-50 blur-[2px] sm:block'
                      : 'pointer-events-none z-0 hidden scale-[0.85] opacity-0 blur-[4px] sm:block'
                }`}
              >
                <div
                  aria-hidden={!active ? true : undefined}
                  inert={!active ? true : undefined}
                  className="h-full"
                >
                  {item.content}
                </div>
                {neighbor && (
                  <button
                    type="button"
                    aria-label={labels.selection
                      .replace('{numero}', String(index + 1))
                      .replace('{nombre}', item.label)}
                    aria-controls={`${id}-${item.id}`}
                    onClick={() => selectNeighbor(index)}
                    className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-sky-text"
                  />
                )}
              </div>
            );
          })}
        </div>
        <CarouselControls
          controlsId={id}
          previousLabel={labels.previous}
          nextLabel={labels.next}
          previousDisabled={items.length === 1}
          nextDisabled={items.length === 1}
          onPrevious={previous}
          onNext={next}
        />
      </div>
      <p
        aria-live="polite"
        aria-atomic="true"
        className="mx-auto mt-4 w-fit rounded-lg px-3 py-2 text-center text-sm text-brand-ink/70 group-focus-visible/carrusel:bg-white/70 group-focus-visible/carrusel:text-brand-ink group-focus-visible/carrusel:underline group-focus-visible/carrusel:underline-offset-4"
      >
        {position}
      </p>
    </div>
  );
}
