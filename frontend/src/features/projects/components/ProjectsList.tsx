import { ArrowUpDown, Plus } from "lucide-react";
import type { SortField } from "@/common/types/sort.types";

import {
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  Table,
  TableHead,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/common/utils/dateFormatter";
import { SortHeader } from "@/common/components/SortHeader";
import type { Project } from "../types/project.types";
import {
  ProjectStatusLabel,
  ProjectStatusStyles,
} from "../utils/project.constants";

interface Props {
  projects: Project[];
  isLoading: boolean;
  openProject: (projectId: string) => void;
  onCreateProject: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  canCreateProject: boolean;

  sortField: SortField;
  sortOrder: "asc" | "desc";
  onSort: (field: SortField) => void;
}

export default function ProjectsList({
  projects,
  isLoading,
  openProject,
  onCreateProject,
  onClearFilters,
  canCreateProject,
  hasActiveFilters,
  sortField,
  sortOrder,
  onSort,
}: Props) {
  return (
    <>
      {isLoading ? (
        <div className="flex flex-col h-full min-h-0">
          <div className="flex flex-1 overflow-auto rounded-2xl border border-border/60 bg-background shadow-sm">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 py-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                      Name
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-30 group-hover:opacity-80 transition" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                      Status
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-30 group-hover:opacity-80 transition" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                      Owner
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-30 group-hover:opacity-80 transition" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                      Created
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-30 group-hover:opacity-80 transition" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                      Last Activity
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-30 group-hover:opacity-80 transition" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
                    <TableCell className="px-4 py-4">
                      <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
                    </TableCell>

                    <TableCell className="px-4 py-4">
                      <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
                    </TableCell>

                    <TableCell className="px-4 py-4">
                      <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
                    </TableCell>

                    <TableCell className="px-4 py-4">
                      <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                    </TableCell>

                    <TableCell className="px-4 py-4">
                      <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : projects.length > 0 ? (
        <div className="flex flex-col h-full min-h-0">
          <div className="flex flex-1 overflow-auto rounded-2xl border border-border/60 bg-background shadow-sm">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
                <TableRow className="hover:bg-transparent">
                  <SortHeader
                    label="Name"
                    field="name"
                    sortField={sortField}
                    order={sortOrder}
                    onSort={onSort}
                  />

                  <SortHeader
                    label="Status"
                    field="status"
                    sortField={sortField}
                    order={sortOrder}
                    onSort={onSort}
                  />

                  <SortHeader
                    label="Owner"
                    field="owner"
                    sortField={sortField}
                    order={sortOrder}
                    onSort={onSort}
                  />

                  <SortHeader
                    label="Created"
                    field="createdAt"
                    sortField={sortField}
                    order={sortOrder}
                    onSort={onSort}
                  />

                  <SortHeader
                    label="Last Activity"
                    field="lastActivityAt"
                    sortField={sortField}
                    order={sortOrder}
                    onSort={onSort}
                  />
                </TableRow>
              </TableHeader>

              <TableBody>
                {projects.map((project) => (
                  <TableRow
                    key={project.id}
                    onClick={() => openProject(project.id)}
                    className="group cursor-pointer transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="px-4 py-3">
                      <div className="max-w-72 font-medium truncate group-hover:text-primary transition-colors">
                        {project.name}
                      </div>
                      <div className="mt-1 max-w-96 truncate text-xs text-muted-foreground">
                        {project.description?.trim() || "No description"}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${ProjectStatusStyles[project.status]}`}
                      >
                        {ProjectStatusLabel[project.status]}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="truncate text-muted-foreground">
                        {project.owner?.firstName ??
                          project.createdBy?.firstName}
                        {project.owner?.lastName ?? project.createdBy?.lastName}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(project.createdAt)}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(project.lastActivityAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/75 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            {hasActiveFilters ? "No matching projects" : "No projects yet"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {hasActiveFilters
              ? "Try clearing the search or filters to see more projects."
              : "Create a project to start organizing this team's work."}
          </p>

          {hasActiveFilters ? (
            <Button
              variant="outline"
              className="mt-6 rounded-xl"
              onClick={onClearFilters}
            >
              Clear filters
            </Button>
          ) : canCreateProject ? (
            <Button className="mt-6 rounded-xl" onClick={onCreateProject}>
              <Plus className="h-4 w-4" />
              Create project
            </Button>
          ) : null}
        </div>
      )}
    </>
  );
}
