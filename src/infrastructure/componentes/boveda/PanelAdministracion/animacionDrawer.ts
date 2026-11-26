export function animacionDrawer(abierto: boolean) {
  return `transition-[transform,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
    abierto ? 'visible translate-x-0' : 'invisible -translate-x-full'
  }`;
}
