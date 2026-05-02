import { useNavigate } from "react-router-dom";
import { ArrowUpDown, Plus } from "lucide-react";

import type { Task } from "../types/task.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { formatDate } from "../../../common/utils/dateFormatter";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { TaskStatusLabel, TaskStatusStyles } from "../utils/taskStatus";
import PriorityBadge from "../../../common/components/PriorityBadge";
import {
  Pagination,
  type PaginationProps,
} from "../../../common/components/pagination/Pagination";
import { Button } from "../../../components/ui/button";

interface Props {
  tasks: Task[];
  teamId: string;
  projectId: string;
  pagination: PaginationProps;
  sort: string;
  onSortChange: (sort: string) => void;
  isLoading?: boolean;
  canCreateTask?: boolean;
  hasActiveFilters?: boolean;
  onCreateTask?: () => void;
}

const SORT_COLUMNS = [
  ["title", "Title"],
  ["priority", "Priority"],
  ["status", "Status"],
  ["assignee", "Assignee"],
  ["support", "Support"],
  ["plannedStartDate", "Start"],
  ["plannedDueDate", "Due"],
  ["lastActivityAt", "Last Activity"],
];

export default function TaskList({
  tasks,
  teamId,
  projectId,
  pagination,
  sort,
  onSortChange,
  isLoading = false,
  canCreateTask = false,
  hasActiveFilters = false,
  onCreateTask,
}: Props) {
  const navigate = useNavigate();

  function openTask(taskId: string) {
    navigate(`/teams/${teamId}/projects/${projectId}/tasks/${taskId}`);
  }

  function handleSort(field: string) {
    const [currentField, direction] = sort.split(",");

    if (currentField === field) {
      const newDir = direction === "asc" ? "desc" : "asc";
      onSortChange(`${field},${newDir}`);
    } else {
      onSortChange(`${field},asc`);
    }
  }

  const header = (
    <TableHeader className="sticky top-0 bg-background z-10">
      <TableRow>
        <TableHead className="w-20">#</TableHead>

        {SORT_COLUMNS.map(([field, label]) => (
          <TableHead
            key={field}
            className="cursor-pointer select-none"
            onClick={() => handleSort(field)}
          >
            <span className="inline-flex items-center gap-2">
              {label}
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-40" />
            </span>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-border/60 bg-background/70 p-4">
      {isLoading ? (
        <div className="flex-1 min-h-0 overflow-auto">
          <Table>
            {header}

            <TableBody>
              {Array.from({ length: 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-transparent">
                  {Array.from({ length: 9 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex} className="py-4">
                      <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border/70 bg-background/60 px-6 py-14 text-center">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {hasActiveFilters ? "No tasks match these filters" : "No tasks yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {hasActiveFilters
                ? "Try changing the search or task filters."
                : "Create the first task to start tracking work in this project."}
            </p>

            {!hasActiveFilters && canCreateTask && onCreateTask && (
              <Button className="mt-6 rounded-xl" onClick={onCreateTask}>
                <Plus className="h-4 w-4" />
                Create task
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-auto">
          <Table>
            {header}

            <TableBody>
              {tasks.map((task) => (
                <TableRow
                  key={task.id}
                  onClick={() => openTask(task.id)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="text-muted-foreground">
                    #{task.taskNumber}
                  </TableCell>

                  <TableCell className="max-w-40">
                    <div className="font-medium truncate">{task.title}</div>
                  </TableCell>

                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>

                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${
                        TaskStatusStyles[task.status]
                      }`}
                    >
                      {TaskStatusLabel[task.status]}
                    </div>
                  </TableCell>

                  <TableCell>
                    {task.assignedUser ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback>
                            {task.assignedUser.firstName[0]}
                            {task.assignedUser.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {task.assignedUser.firstName}{" "}
                          {task.assignedUser.lastName}
                        </span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
                    {task.supportUser ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback>
                            {task.supportUser.firstName[0]}
                            {task.supportUser.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {task.supportUser.firstName} {task.supportUser.lastName}
                        </span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>{formatDate(task.plannedStartDate)}</TableCell>

                  <TableCell>{formatDate(task.plannedDueDate)}</TableCell>

                  <TableCell>{formatDate(task.lastActivityAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && tasks.length > 0 && pagination.totalPages > 1 && (
        <Pagination
          page={pagination.page}
          size={pagination.size}
          totalPages={pagination.totalPages}
          totalElements={pagination.totalElements}
          onPageChange={pagination.onPageChange}
          onSizeChange={(size) => {
            pagination.onPageChange(0);
            pagination.onSizeChange(size);
          }}
        />
      )}
    </div>
  );
}
