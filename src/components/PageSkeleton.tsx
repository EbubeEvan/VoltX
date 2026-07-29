export function SkeletonGrid() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 h-9 w-48 animate-pulse rounded-lg bg-secondary/50" />
      <div className="mb-6 h-9 w-72 animate-pulse rounded-lg bg-secondary/50" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-card overflow-hidden">
            <div className="aspect-square animate-pulse bg-secondary/50" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-secondary/50" />
              <div className="h-4 w-full animate-pulse rounded bg-secondary/50" />
              <div className="h-3 w-24 animate-pulse rounded bg-secondary/50" />
              <div className="h-6 w-20 animate-pulse rounded bg-secondary/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonHome() {
  return (
    <div>
      <div className="h-[70vh] animate-pulse bg-secondary/30" />
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 h-8 w-48 animate-pulse rounded-lg bg-secondary/50" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <div className="aspect-square animate-pulse bg-secondary/50" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-16 animate-pulse rounded bg-secondary/50" />
                <div className="h-4 w-full animate-pulse rounded bg-secondary/50" />
                <div className="h-6 w-20 animate-pulse rounded bg-secondary/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-6 h-4 w-64 animate-pulse rounded bg-secondary/50" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="glass-card aspect-square animate-pulse bg-secondary/50" />
        <div className="space-y-6">
          <div className="h-4 w-24 animate-pulse rounded bg-secondary/50" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-secondary/50" />
          <div className="h-4 w-48 animate-pulse rounded bg-secondary/50" />
          <div className="h-12 w-40 animate-pulse rounded bg-secondary/50" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-secondary/50" />
            <div className="h-4 w-full animate-pulse rounded bg-secondary/50" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-secondary/50" />
          </div>
          <div className="h-14 w-full animate-pulse rounded-lg bg-secondary/50" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <div className="glass-card flex items-center gap-6 p-6">
        <div className="h-20 w-20 animate-pulse rounded-full bg-secondary/50" />
        <div className="space-y-2">
          <div className="h-7 w-40 animate-pulse rounded bg-secondary/50" />
          <div className="h-4 w-56 animate-pulse rounded bg-secondary/50" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card space-y-2 p-4">
            <div className="mx-auto h-5 w-5 animate-pulse rounded bg-secondary/50" />
            <div className="mx-auto h-8 w-12 animate-pulse rounded bg-secondary/50" />
            <div className="mx-auto h-3 w-16 animate-pulse rounded bg-secondary/50" />
          </div>
        ))}
      </div>
      <div className="mt-10 space-y-4">
        <div className="h-7 w-36 animate-pulse rounded bg-secondary/50" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card flex items-center justify-between p-4">
            <div className="space-y-1">
              <div className="h-5 w-24 animate-pulse rounded bg-secondary/50" />
              <div className="h-3 w-32 animate-pulse rounded bg-secondary/50" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded bg-secondary/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonOrder() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-6 h-4 w-48 animate-pulse rounded bg-secondary/50" />
      <div className="glass-card mb-8 flex items-center justify-between p-6">
        <div className="space-y-2">
          <div className="h-8 w-52 animate-pulse rounded bg-secondary/50" />
          <div className="h-4 w-64 animate-pulse rounded bg-secondary/50" />
        </div>
        <div className="h-7 w-20 animate-pulse rounded-full bg-secondary/50" />
      </div>
      <div className="h-6 w-32 animate-pulse rounded bg-secondary/50 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="glass-card flex items-center gap-4 p-4">
            <div className="h-16 w-16 animate-pulse rounded-lg bg-secondary/50" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-secondary/50" />
              <div className="h-3 w-20 animate-pulse rounded bg-secondary/50" />
            </div>
            <div className="h-5 w-24 animate-pulse rounded bg-secondary/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCheckout() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <div className="mb-8 h-9 w-48 animate-pulse rounded bg-secondary/50" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card flex gap-4 p-4">
              <div className="h-24 w-24 animate-pulse rounded-lg bg-secondary/50" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-secondary/50" />
                <div className="h-4 w-40 animate-pulse rounded bg-secondary/50" />
                <div className="h-8 w-32 animate-pulse rounded bg-secondary/50" />
              </div>
            </div>
          ))}
        </div>
        <div className="glass-card space-y-4 p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-secondary/50" />
          ))}
          <div className="h-12 w-full animate-pulse rounded-lg bg-secondary/50" />
        </div>
      </div>
    </div>
  );
}
