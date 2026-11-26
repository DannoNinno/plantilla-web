export default function SkeletonSimulacion() {
  return (
    <div role="status" aria-live="polite" aria-label="Cargando simulación" className="space-y-6">
      <span className="sr-only">Cargando simulación…</span>

      <div
        className="h-9 w-44 animate-skeleton bg-brand-sky/15 motion-reduce:animate-none"
        aria-hidden="true"
      />

      <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <section className="space-y-4" aria-hidden="true">
          <div className="h-7 w-52 animate-skeleton bg-brand-sky/15 motion-reduce:animate-none" />
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {Array.from({length: 9}, (_, indice) => (
              <div
                key={indice}
                className="flex min-h-14 items-center gap-3 border border-brand-sky/20 bg-brand-ink p-3"
              >
                <div className="h-5 w-5 animate-skeleton bg-brand-sky/25 motion-reduce:animate-none" />
                <div
                  className="h-4 animate-skeleton bg-brand-sky/15 motion-reduce:animate-none"
                  style={{width: `${55 + ((indice * 11) % 35)}%`}}
                />
                <div className="ml-auto h-4 w-4 animate-skeleton bg-brand-sky/20 motion-reduce:animate-none" />
              </div>
            ))}
          </div>
        </section>

        <div className="min-w-0 space-y-8" aria-hidden="true">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="h-7 w-28 animate-skeleton bg-brand-sky/15 motion-reduce:animate-none" />
              <div className="h-4 w-20 animate-skeleton bg-brand-sky/15 motion-reduce:animate-none" />
            </div>
            <div className="min-h-64 space-y-3 border-2 border-dashed border-brand-sky/30 p-3">
              <div className="flex min-h-20 items-center gap-3 border-l-4 border-brand-coral bg-brand-ink p-4">
                <div className="h-10 w-10 animate-skeleton bg-brand-sky/15 motion-reduce:animate-none" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 animate-skeleton bg-brand-sky/20 motion-reduce:animate-none" />
                  <div className="h-3 w-36 animate-skeleton bg-brand-sky/10 motion-reduce:animate-none" />
                </div>
                <div className="h-5 w-5 animate-skeleton bg-brand-sky/15 motion-reduce:animate-none" />
              </div>
              <div className="flex min-h-20 items-center gap-3 border border-brand-sky/20 bg-brand-ink p-4">
                <div className="h-10 w-10 animate-skeleton bg-brand-sky/10 motion-reduce:animate-none" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-skeleton bg-brand-sky/15 motion-reduce:animate-none" />
                  <div className="h-3 w-44 animate-skeleton bg-brand-sky/10 motion-reduce:animate-none" />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-5 border-t border-brand-sky/30 pt-6">
            <div className="h-7 w-44 animate-skeleton bg-brand-sky/15 motion-reduce:animate-none" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="h-4 w-24 animate-skeleton bg-brand-sky/15 motion-reduce:animate-none" />
                <div className="h-12 animate-skeleton border border-brand-sky/30 bg-brand-ink motion-reduce:animate-none" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-28 animate-skeleton bg-brand-sky/15 motion-reduce:animate-none" />
                <div className="h-12 animate-skeleton border border-brand-sky/30 bg-brand-ink motion-reduce:animate-none" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[0, 1].map((indice) => (
                <div key={indice} className="flex h-12 items-center gap-3">
                  <div className="h-5 w-5 animate-skeleton border border-brand-sky/30 motion-reduce:animate-none" />
                  <div className="h-4 w-44 animate-skeleton bg-brand-sky/15 motion-reduce:animate-none" />
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center gap-4 border-t border-brand-sky/30 pt-6">
            <div className="h-12 w-28 animate-skeleton bg-brand-sky/30 motion-reduce:animate-none" />
            <div className="h-4 max-w-md flex-1 animate-skeleton bg-brand-sky/10 motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
