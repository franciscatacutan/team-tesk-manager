import {
  DELETED_FILTER,
  type DeletedFilter,
} from "../../../common/types/deletedFilter.types";
import { FilterPopover } from "../../../common/components/FilterPopover";
import type { ProjectPermissions } from "../utils/projectPermissions";
import { PROJECT_STATUS_FILTER } from "../constants/projectFilter.constants";
import SearchBar from "@/common/components/SearchBar";
import { SortControl } from "@/common/components/SortControl";
import type { SortField, SortOrder } from "@/common/types/sort.types";

type FilterValues = Record<string, string | string[] | undefined>;

interface Props {
  permissions: ProjectPermissions;

  search: {
    value: string;
    onChange: (value: string) => void;
  };

  filters: {
    values: FilterValues;
    onChange: (key: string, value: string | string[]) => void;
    onDeletedChange: (value: DeletedFilter) => void;
  };

  view: "board" | "list";

  sort: {
    field: SortField;
    order: SortOrder;
    options: { label: string; value: SortField }[];
    onFieldChange: (field: SortField) => void;
    onToggleOrder: () => void;
  };
}

export default function ProjectsToolbar({
  permissions,
  search,
  filters,
  view,
  sort,
}: Props) {
  const filterConfig = permissions.canViewDeleteProject
    ? [...PROJECT_STATUS_FILTER, ...DELETED_FILTER]
    : PROJECT_STATUS_FILTER;

  const handleFilterChange = (key: string, value: string | string[]) => {
    if (key === "status") {
      filters.onChange("statusFilter", value);
      return;
    }

    if (key === "deletedFilter") {
      const nextValue = typeof value === "string" ? value : "";
      filters.onChange("deletedFilter", nextValue);
    }
  };

  return (
    <section className="rounded-2xl border border-border/60 bg-background/92 p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="relative w-full">
          <SearchBar search={search.value} searchChange={search.onChange} />
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[24rem]">
          <FilterPopover
            label="Visibility"
            config={filterConfig}
            values={filters.values}
            onChange={handleFilterChange}
            onClear={() => {
              filters.onChange("statusFilter", []);
              filters.onDeletedChange("ACTIVE");
            }}
          />
          {view === "board" && (
            <SortControl
              field={sort.field}
              order={sort.order}
              options={sort.options}
              onFieldChange={sort.onFieldChange}
              onToggleOrder={sort.onToggleOrder}
            />
          )}
        </div>
      </div>
    </section>
  );
}
