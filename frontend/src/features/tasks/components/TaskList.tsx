import { useNavigate } from "react-router-dom";

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

interface Props {
  tasks: Task[];
  teamId: string;
  projectId: string;
  pagination: PaginationProps;
  sort: string;
  onSortChange: (sort: string) => void;
}

export default function TaskList({
  tasks,
  teamId,
  projectId,
  pagination,
  sort,
  onSortChange,
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

  return (
    <div className=" flex flex-col h-full min-h-0 p-4 rounded-xl border border-border/60 bg-background/70">
      <div className="flex-1 min-h-0 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-20">#</TableHead>

              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("title")}
              >
                Title
              </TableHead>

              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("priority")}
              >
                Priority
              </TableHead>

              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("status")}
              >
                Status
              </TableHead>

              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("assignee")}
              >
                Assignee
              </TableHead>

              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("support")}
              >
                Support
              </TableHead>

              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("plannedStartDate")}
              >
                Start
              </TableHead>

              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("plannedDueDate")}
              >
                Due
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("lastActivityAt")}
              >
                Last Activity
              </TableHead>
            </TableRow>
          </TableHeader>

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
                        {task.assignedUser.firstName +
                          " " +
                          task.assignedUser.lastName}
                      </span>
                    </div>
                  ) : (
                    "—"
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
                        {task.supportUser.firstName +
                          " " +
                          task.supportUser.lastName}
                      </span>
                    </div>
                  ) : (
                    "—"
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
      {pagination.totalPages > 1 && (
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
