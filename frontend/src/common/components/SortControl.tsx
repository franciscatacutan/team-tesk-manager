import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export interface SortOption<T extends string> {
  label: string;
  value: T;
}

interface Props<T extends string> {
  field: T;
  order: "asc" | "desc";
  options: SortOption<T>[];

  onFieldChange: (field: T) => void;
  onToggleOrder: () => void;
}

export function SortControl<T extends string>({
  field,
  order,
  options,
  onFieldChange,
  onToggleOrder,
}: Props<T>) {
  const active = options.find((o) => o.value === field);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="group flex items-center gap-3 h-10 px-4 rounded-xl border border-border/70 bg-background hover:bg-muted/50 shadow-sm hover:shadow-md transition-all">
          <span className="text-sm">{active?.label ?? "Sort"}</span>

          <span className="h-5 w-0.5 bg-border/80 rounded-full" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleOrder();
            }}
            className=" flex items-center gap-1 text-sm px-1.5 py-0.5 rounded-md bg-muted/50 group-hover:bg-muted transition"
          >
            <span className="text-base leading-none">
              {order === "asc" ? "↑" : "↓"}
            </span>
          </button>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-3 space-y-2">
        <p className="text-xs text-muted-foreground">Sort by</p>

        {options.map((opt) => {
          const isActive = field === opt.value;

          return (
            <button
              key={opt.value}
              onClick={() => onFieldChange(opt.value)}
              className={` w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
            >
              {opt.label}

              {isActive && (
                <span className="text-xs opacity-70">
                  {order === "asc" ? "↑" : "↓"}
                </span>
              )}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
