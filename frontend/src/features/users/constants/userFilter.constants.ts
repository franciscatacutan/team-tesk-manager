import type { FilterGroup } from "@/common/types/filter.types";
import { USER_ROLE_LABEL } from "./user.constants";

export const USER_ROLE_FILTER: FilterGroup[] = [
  {
    key: "roleFilter",
    label: "Roles",
    type: "multi",
    options: Object.entries(USER_ROLE_LABEL).map(([value, label]) => ({
      value,
      label,
    })),
  },
];
