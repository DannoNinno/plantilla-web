'use client';

import {useRef, useState} from 'react';
import type {KeyboardEvent, MouseEvent, TouchEvent} from 'react';

export function useCarousel(itemCount: number) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<{x: number; y: number} | null>(null);
  const swiped = useRef(false);
  if (!Number.isInteger(itemCount) || itemCount < 1) {
    throw new Error('El carrusel necesita al menos un elemento.');
  }

  const clamp = (value: number) => Math.max(0, Math.min(itemCount - 1, value));
  const activeIndex = clamp(index);
  const previous = () => setIndex((value) => clamp(clamp(value) - 1));
  const next = () => setIndex((value) => clamp(clamp(value) + 1));

  function select(value: number) {
    if (!Number.isInteger(value)) throw new Error('El indice del carrusel debe ser entero.');
    setIndex(clamp(value));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    switch (event.key) {
      case 'ArrowLeft':
        previous();
        break;
      case 'ArrowRight':
        next();
        break;
      case 'Home':
        select(0);
        break;
      case 'End':
        select(itemCount - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    swiped.current = false;
    touchStart.current =
      event.touches.length === 1
        ? {x: event.touches[0].clientX, y: event.touches[0].clientY}
        : null;
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || event.changedTouches.length !== 1) return;
    const deltaX = event.changedTouches[0].clientX - start.x;
    const deltaY = event.changedTouches[0].clientY - start.y;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.25) return;
    swiped.current = true;
    if (deltaX < 0) next();
    else previous();
  }

  function onClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (swiped.current && event.detail !== 0) {
      event.preventDefault();
      event.stopPropagation();
    }
    swiped.current = false;
  }

  return {
    activeIndex,
    previous,
    next,
    select,
    onKeyDown,
    swipeHandlers: {
      onTouchStart,
      onTouchEnd,
      onTouchCancel: () => {
        touchStart.current = null;
        swiped.current = false;
      },
      onPointerDown: () => {
        swiped.current = false;
      },
      onClickCapture,
    },
  };
}
