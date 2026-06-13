import type { FilterGroup } from "@/common/types/filter.types";
import { ProjectStatusLabel } from "../utils/project.constants";

export const PROJECT_STATUS_FILTER: FilterGroup[] = [
  {
    key: "statusFilter",
    label: "Status",
    type: "multi",
    options: Object.entries(ProjectStatusLabel).map(([value, label]) => ({
      value,
      label,
    })),
  },
];
