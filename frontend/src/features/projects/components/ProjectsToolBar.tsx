import { Search } from "lucide-react";

import {
  DELETED_FILTER,
  type DeletedFilter,
} from "../../../common/types/deletedFilter.types";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/select";
import { FilterPopover } from "../../../common/components/FilterPopover";
import type { ProjectPermissions } from "../utils/projectPermissions";
import { PROJECT_STATUS_FILTER } from "../constants/projectFilter.constants";

interface Props {
  permissions: ProjectPermissions;
  search: string;
  status: string;
  sort: string;
  deletedFilter: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onDeletedFilterChange: (value: DeletedFilter) => void;
}

export default function ProjectsToolbar({
  permissions,
  search,
  status,
  sort,
  deletedFilter,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onDeletedFilterChange,
}: Props) {
  const filterConfig = permissions.canViewDeleteProject
    ? [...PROJECT_STATUS_FILTER, ...DELETED_FILTER]
    : PROJECT_STATUS_FILTER;

  const handleFilterChange = (key: string, value: string | string[]) => {
    const nextValue = typeof value === "string" ? value : "";

    if (key === "status") {
      onStatusChange(nextValue);
      return;
    }

    if (key === "deletedFilter") {
      onDeletedFilterChange((nextValue || "ACTIVE") as DeletedFilter);
    }
  };

  return (
    <section className="rounded-2xl border border-border/60 bg-background/92 p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 rounded-xl border-border/70 bg-background pl-9 shadow-none"
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[24rem]">
          <FilterPopover
            label="Filters"
            config={filterConfig}
            values={{
              status,
              deletedFilter,
            }}
            onChange={handleFilterChange}
            onClear={() => {
              onStatusChange("");
              onDeletedFilterChange("ACTIVE");
            }}
          />

          <div className="space-y-1">
            <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Sort
            </label>
            <Select value={sort} onValueChange={onSortChange}>
              <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background shadow-none">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt,desc">Newest</SelectItem>
                <SelectItem value="createdAt,asc">Oldest</SelectItem>
                <SelectItem value="lastActivityAt,desc">
                  Last Activity
                </SelectItem>
                <SelectItem value="name,asc">Name (A-Z)</SelectItem>
                <SelectItem value="updatedAt,desc">Last Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
