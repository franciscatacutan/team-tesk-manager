export default function WorkspaceSkeleton() {
  return (
    <div className="flex h-full w-full min-h-0">
      <aside className="relative flex h-full flex-col border-r border-border/60 bg-background/85 backdrop-blur w-50">
        <div className="border-b border-border/60 px-3 py-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-muted/40" />
          </div>
        </div>

        <div className="flex-1 space-y-1 p-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            >
              <div className="h-5 w-5 animate-pulse rounded-md bg-muted/40" />

              <div className="h-4 w-24 animate-pulse rounded-md bg-muted/40" />
            </div>
          ))}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-6 overflow-auto p-4 sm:p-5 lg:p-6">
          <div className="space-y-3">
            <div className="h-8 w-64 animate-pulse rounded-lg bg-muted/40" />

            <div className="h-4 w-96 animate-pulse rounded-md bg-muted/30" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-2xl border border-border/60 bg-background"
              />
            ))}
          </div>

          <div className="h-105 animate-pulse rounded-2xl border border-border/60 bg-background" />
        </div>
      </main>
    </div>
  );
}
