import { useTasks } from "./useTasks";
import TaskItem from "./TaskItem";
import type { Task } from "./task.types";

type Props = {
  projectId: number;
  onSelectTask: (task: Task) => void;
};

/*
 * Component to display a list of tasks for a given project.
 */
export default function TaskList({ projectId, onSelectTask }: Props) {
  const { data, isLoading, isError } = useTasks(projectId);

  if (isLoading) {
    return <p className="text-gray-500">Loading tasks...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Failed to load tasks</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-gray-500">No tasks yet</p>;
  }

  return (
    <div className="space-y-3">
      {/*
       * Render each task item
       */}
      {data.map((task) => (
        <TaskItem key={task.id} task={task} onClick={onSelectTask} />
      ))}
    </div>
  );
}
