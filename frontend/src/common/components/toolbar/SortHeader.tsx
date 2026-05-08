import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableHead } from "@/components/ui/table";
import type { SortField, SortOrder } from "@/common/types/sort.types";

interface Props {
  label: string;
  field: SortField;
  sortField: SortField;
  order: SortOrder;
  onSort: (field: SortField) => void;
}

export function SortHeader({ label, field, sortField, order, onSort }: Props) {
  const isActive = sortField === field;

  return (
    <TableHead
      onClick={() => onSort(field)}
      aria-sort={
        isActive ? (order === "asc" ? "ascending" : "descending") : "none"
      }
      className="group cursor-pointer select-none px-4 py-3"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        <span
          className={cn(
            "transition-colors",
            isActive
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        >
          {label}
        </span>

        <span className="flex items-center">
          {isActive ? (
            order === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5 text-primary transition-all" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5 text-primary transition-all" />
            )
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-30 group-hover:opacity-80 transition" />
          )}
        </span>
      </div>
    </TableHead>
  );
}
