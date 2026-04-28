import type { SortField } from "@/common/types/sort.types";

export const BASE_SORT_OPTIONS: { label: string; value: SortField }[] = [
  { label: "Created", value: "createdAt" },
  { label: "Name", value: "name" },
  { label: "Activity", value: "lastActivityAt" },
];

export const TEAM_LIST_SORT_OPTIONS: { label: string; value: SortField }[] = [
  ...BASE_SORT_OPTIONS,
  { label: "Owner", value: "owner" },
];
