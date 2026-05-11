import type { DeletedFilter } from "../../../common/types/deletedFilter.types";

import type { ProjectStatus } from "./project.types";

export interface ProjectSearchParams {
  page?: number;

  size?: number;

  search?: string;

  status?: ProjectStatus[];

  sort?: string;

  all?: boolean;

  deletedFilter?: DeletedFilter;
}
