import type { SortField } from "../types/sort.types";

export const BASE_SORT_OPTIONS: { label: string; value: SortField }[] = [
  { label: "Name", value: "name" },
  { label: "Created", value: "createdAt" },
  { label: "Activity", value: "lastActivityAt" },
];
