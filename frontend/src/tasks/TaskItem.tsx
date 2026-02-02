import type { Task } from "./task.types";

type Props = {
  task: Task;
  onClick: (task: Task) => void;
};

/*
 * Component to display a single task item in the task list.
 */
export default function TaskItem({ task, onClick }: Props) {
  const statusStyles: Record<string, string> = {
    TODO: "bg-gray-100 text-gray-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    DONE: "bg-green-100 text-green-700",
  };

  return (
    <button
      type="button"
      onClick={() => onClick(task)}
      className="
    group
    w-full
    rounded-lg border border-gray-200
    bg-white p-4
    text-left
    shadow-sm
    transition-all duration-200
    hover:-translate-y-[1px] hover:bg-gray-50 hover:shadow-md
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
  "
    >
      <div className="flex items-start justify-between gap-4">
        {/* LEFT */}
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {task.description}
            </p>
          )}

          <p className="mt-1 text-xs text-gray-500">
            Assigned to:{" "}
            <span className="font-medium text-gray-700">
              {task.assignedUser
                ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}`
                : "Unassigned"}
            </span>
          </p>
        </div>

        {/* RIGHT */}
        {/* <span
          className="
        shrink-0
        rounded-full px-2.5 py-1
        text-xs font-medium
        bg-gray-100 text-gray-700
      "
        >
          {task.status}
        </span> */}
        <span
          className={`
    shrink-0 rounded-full px-2.5 py-1
    text-xs font-medium
    ${statusStyles[task.status] ?? "bg-gray-100 text-gray-700"}
  `}
        >
          {task.status}
        </span>
      </div>
    </button>
  );
}
