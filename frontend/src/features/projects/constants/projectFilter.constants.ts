import type { FilterGroup } from "@/common/types/filter.types";
import { ProjectStatusLabel } from "../utils/projectStatus";

export const PROJECT_STATUS_FILTER: FilterGroup[] = [
  {
    key: "status",
    label: "Status",
    type: "single",
    options: Object.entries(ProjectStatusLabel).map(([value, label]) => ({
      value,
      label,
    })),
  },
];
