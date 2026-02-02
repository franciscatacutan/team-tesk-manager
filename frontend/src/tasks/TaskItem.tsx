import type { Task } from "./task.types";

type Props = {
  task: Task;
  onClick: (task: Task) => void;
};

/*
 * Component to display a single task item in the task list.
 */
export default function TaskItem({ task, onClick }: Props) {
  return (
    <div
      // On click pass the task to the onClick handler
      onClick={() => onClick(task)}
      className="
        p-4 rounded-lg border
        bg-white hover:bg-gray-50
        cursor-pointer transition
        flex items-center justify-between
      "
    >
      <div>
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.description}</p>

        <p className="text-xs text-gray-400 mt-1">
          Assigned to:{" "}
          {task.assignedUser
            ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}`
            : "None"}
        </p>
      </div>

      <span
        className="
          text-xs px-2 py-1 rounded-full
          bg-gray-200
        "
      >
        {task.status}
      </span>
    </div>
  );
}
