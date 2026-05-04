import { Input } from "../../../components/ui/input";
import { useAuth } from "../../auth/hooks/useAuth";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";
import { DELETED_FILTER } from "../../../common/types/deletedFilter.types";
import { Search } from "lucide-react";
import { FilterPopover } from "../../../common/components/FilterPopover";
import type { FilterGroup } from "../../../common/types/filter.types";
import { TaskStatusLabel } from "../utils/task.constants";

const TASK_STATUS_FILTER: FilterGroup[] = [
  {
    key: "status",
    label: "Status",
    type: "single",
    options: Object.entries(TaskStatusLabel).map(([value, label]) => ({
      value,
      label,
    })),
  },
];

type Props = {
  search: string;
  status: string;
  deletedFilter: DeletedFilter;

  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onDeletedFilterChange: (value: DeletedFilter) => void;
};

export default function TaskFilters({
  search,
  status,
  deletedFilter,
  onSearchChange,
  onStatusFilterChange,
  onDeletedFilterChange,
}: Props) {
  const { isGlobalAdmin } = useAuth();

  const filterConfig = isGlobalAdmin
    ? [...TASK_STATUS_FILTER, ...DELETED_FILTER]
    : TASK_STATUS_FILTER;

  const filterValues = {
    status,
    deletedFilter,
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    const nextValue = typeof value === "string" ? value : "";

    if (key === "status") {
      onStatusFilterChange(nextValue);
      return;
    }

    if (key === "deletedFilter") {
      onDeletedFilterChange((nextValue || "ACTIVE") as DeletedFilter);
    }
  };

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 rounded-xl border-border/70 bg-background pl-9 shadow-none"
        />
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
        <FilterPopover
          label="Filters"
          config={filterConfig}
          values={filterValues}
          onChange={handleFilterChange}
          onClear={() => {
            onStatusFilterChange("");
            onDeletedFilterChange("ACTIVE");
          }}
        />
      </div>
    </div>
  );
}
