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
      className="mt-6 min-w-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-sky-text"
    >
      <p id={`${id}-help`} className="sr-only">
        {labels.help}
      </p>
      <div className="relative -mx-4 sm:mx-0">
        <CarouselControls
          controlsId={id}
          previousLabel={labels.previous}
          nextLabel={labels.next}
          previousDisabled={activeIndex === 0}
          nextDisabled={activeIndex === items.length - 1}
          onPrevious={previous}
          onNext={next}
        />
        <div
          id={id}
          {...swipeHandlers}
          className="isolate grid min-w-0 touch-pan-y items-stretch justify-items-center overflow-hidden py-6 sm:py-8"
        >
          {items.map((item, index) => {
            const offset = index - activeIndex;
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
                className={`relative col-start-1 row-start-1 w-[86%] max-w-[26rem] transition-[transform,opacity] duration-[400ms] ease-out motion-reduce:transition-none sm:w-[58%] lg:w-[40%] ${translation} ${
                  active
                    ? 'z-20 scale-100 opacity-100'
                    : neighbor
                      ? 'z-10 scale-[0.85] opacity-40'
                      : 'pointer-events-none z-0 scale-[0.85] opacity-0'
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
      </div>
      <p
        aria-live="polite"
        aria-atomic="true"
        className="mt-4 text-center text-sm text-brand-ink/70"
      >
        {position}
      </p>
    </div>
  );
}
