import type { SortField } from "../types/sort.types";

export const BASE_SORT_OPTIONS: { label: string; value: SortField }[] = [
  { label: "Created", value: "createdAt" },
  { label: "Name", value: "name" },
  { label: "Activity", value: "lastActivityAt" },
];
