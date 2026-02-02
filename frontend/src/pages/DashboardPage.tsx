import { useState } from "react";
import TaskList from "../tasks/TaskList";
import type { Task } from "../tasks/task.types";
import TaskDetailsModal from "../tasks/TaskDetailsModal";
import TaskEditModal from "../tasks/TaskEditModal";
import { useUpdateTask } from "../tasks/useUpdateTask";
import TaskFormModal from "../tasks/TaskFormModal";
import { getCurrentUserFromToken } from "../auth/auth.utils";
import ConfirmDeleteTaskModal from "../tasks/ConfirmDeleteTaskModal";
import { useDeleteTask } from "../tasks/useDeleteTask";
import { useParams } from "react-router-dom";
import { useProjectById } from "../projects/useProjects";

/*
 * Dashboard page showing project tasks.
 */
export default function Dashboard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Open Modals and transfer data
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const updateTask = useUpdateTask(selectedTask?.id || 0);
  const deleteTask = useDeleteTask();

  //Fetch Project Data
  const { id } = useParams();
  const projectId = Number(id);

  // Fetch project and owner
  const { data: project } = useProjectById(projectId);
  const projectOwnerEmail: string = project?.owner.email;

  // Fetch User details from token
  const user = getCurrentUserFromToken();

  // Set User email
  const currentUserEmail = user?.sub;
  // const currentUserId = user?.userId;

  // Checks if Current user is the Project Owner
  const isOwner = currentUserEmail === projectOwnerEmail;
  // Checks if Current user is the assignee
  const isAssignee = selectedTask?.assignedUser?.email === currentUserEmail;

  // Handles Delete Task
  const handleDeleteTask = () => {
    if (!selectedTask) return;

    deleteTask.mutate(
      { projectId: projectId, taskId: selectedTask.id },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setIsDeleteOpen(false);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto p-4">
          <h1 className="text-3xl font-bold">{project?.name}</h1>
          {project?.description && (
            <p className="text-sm text-gray-500">{project.description}</p>
          )}
        </div>
      </header>

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
          projectId={projectId}
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
          isOwner={isOwner}
          // Checks if the current user is an the assigned user
          isAssignee={isAssignee}
          //   Handlers for edit and delete actions
          onEdit={() => {
            setIsDetailsOpen(false);
            setIsEditOpen(true);
          }}
          onDelete={() => {
            setIsDetailsOpen(false);
            setIsDeleteOpen(true);
          }}
          onStatusChange={(status) => updateTask.mutate({ status })}
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
          projectId={projectId}
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
        {/*
         * Confirm Delete Modal
         */}
        <ConfirmDeleteTaskModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteTask}
        />
      </main>
    </div>
  );
}
