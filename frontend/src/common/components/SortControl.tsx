import { Button } from "@/components/ui/button";
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
      <div className="inline-flex h-10 rounded-xl border border-border/70 bg-background shadow-sm hover:shadow-md transition overflow-hidden">
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-full w-25 px-4 rounded-none border-r border-border/60 hover:bg-muted/50"
          >
            <span className="text-sm font-medium">
              {active?.label ?? "Sort"}
            </span>
          </Button>
        </PopoverTrigger>

        <Button
          type="button"
          variant="ghost"
          onClick={onToggleOrder}
          className="h-full px-3 rounded-none border-r border-border/60 hover:bg-muted/50"
        >
          <span className="text-sm leading-none">
            {order === "asc" ? "↑" : "↓"}
          </span>
        </Button>
      </div>

      <PopoverContent align="start" className="w-30 p-2">
        <div className="px-2 py-1 text-xs text-muted-foreground">Sort by</div>

        {options.map((opt) => {
          const isActive = field === opt.value;

          return (
            <Button
              key={opt.value}
              variant="ghost"
              onClick={() => onFieldChange(opt.value)}
              className={`w-full justify-between px-3 py-2 rounded-lg text-sm font-normal ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/50"
              }`}
            >
              {opt.label}

              {isActive && (
                <span className="text-xs opacity-70">
                  {order === "asc" ? "↑" : "↓"}
                </span>
              )}
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
