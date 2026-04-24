import type { FilterGroup } from "@/common/types/filter.types";

export const TEAM_MEMBER_FILTER: FilterGroup[] = [
  {
    key: "rolesFilter",
    label: "Roles",
    type: "multi",
    options: [
      { label: "Member", value: "MEMBER" },
      { label: "Admin", value: "ADMIN" },
      { label: "Owner", value: "OWNER" },
    ],
  },
];
