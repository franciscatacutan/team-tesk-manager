import { useState } from "react";
import TaskList from "../tasks/TaskList";
import type { Task } from "../tasks/task.types";
import TaskDetailsModal from "../tasks/TaskDetailsModal";
import TaskEditModal from "../tasks/TaskEditModal";
import { useUpdateTask } from "../tasks/useUpdateTask";
import TaskFormModal from "../tasks/TaskFormModal";

/*
 * Dashboard page showing project tasks.
 */
export default function Dashboard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const PROJECT_ID = 3; //TEMPORARY: Replace with actual project selection logic
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const currentUserEmail: string = "test1@test.com"; // Temporary
  const projectOwnerEmail: string = "owner@test.com"; // Temporary

  const updateStatus = useUpdateTask(selectedTask?.id || 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto p-4">
          <h1 className="text-2xl font-bold">My Project</h1>
          <p className="text-sm text-gray-500">All tasks under this project</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto p-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tasks</h2>

          <button className="btn" onClick={() => setIsCreateOpen(true)}>
            + Add Task
          </button>
        </div>

        {/*
         * Task List
         */}
        <TaskList
          projectId={PROJECT_ID}
          onSelectTask={(task) => {
            // Pass selected task to selectedTask state
            setSelectedTask(task);
            // Open task details modal
            setIsDetailsOpen(true);
          }}
        />

        {/*
         * Task Details Modal
         */}
        <TaskDetailsModal
          // Pass selectedTask to modal
          task={selectedTask}
          // Set modal open state
          isOpen={isDetailsOpen}
          // Close modal handler
          onClose={() => setIsDetailsOpen(false)}
          // Checks if the current user is the owner
          isOwner={currentUserEmail === projectOwnerEmail}
          // Checks if the current user is an the assigned user
          isAssignee={selectedTask?.assignedUser?.email === currentUserEmail}
          //   Handlers for edit and delete actions
          onEdit={() => {
            setIsDetailsOpen(false);
            setIsEditOpen(true);
          }}
          onStatusChange={(status) => updateStatus.mutate({ status })}
        />
        {/*
         * Task Edit Modal
         */}
        {selectedTask && (
          <TaskEditModal
            task={selectedTask}
            isOwner={currentUserEmail === projectOwnerEmail}
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
          />
        )}

        {/*
         * Task Creation Modal
         */}
        <TaskFormModal
          projectId={PROJECT_ID}
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      </main>
    </div>
  );
}
