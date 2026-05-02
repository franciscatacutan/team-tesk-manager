import { BASE_SORT_OPTIONS } from "@/common/constants/sort.constants";
import type { SortField } from "@/common/types/sort.types";

export const TEAM_LIST_SORT_OPTIONS: { label: string; value: SortField }[] = [
  ...BASE_SORT_OPTIONS,
  { label: "Owner", value: "owner" },
];
