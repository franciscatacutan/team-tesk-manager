import type { FilterGroup } from "@/common/types/filter.types";
import { TaskStatusLabel } from "../utils/task.constants";

export const TASK_STATUS_FILTER: FilterGroup[] = [
  {
    key: "statusFilter",
    label: "Status",
    type: "multi",
    options: Object.entries(TaskStatusLabel).map(([value, label]) => ({
      value,
      label,
    })),
  },
];
