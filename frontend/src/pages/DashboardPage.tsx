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
import EditProjectModal from "../projects/ProjectEditModal";

/*
 * Dashboard page showing project tasks.
 */
export default function Dashboard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Open Modals and transfer data
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [isTaskEditOpen, setIsTaskEditOpen] = useState(false);
  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false);
  const [isTaskDeleteOpen, setIsTaskDeleteOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);

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
          setIsTaskDeleteOpen(false);
          setIsTaskDeleteOpen(false);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div
          className="
      max-w-5xl mx-auto
      px-6 py-4
      flex items-center
      justify-between
    "
        >
          {/* LEFT SIDE */}
          <div>
            <h1 className="text-2xl font-semibold">{project?.name}</h1>

            {project?.description && (
              <p className="text-sm text-gray-500 mt-1">
                {project.description}
              </p>
            )}

            <p className="text-sm text-gray-500 mt-1">
              Owner: {project?.owner.firstName} {project?.owner.lastName}
            </p>
          </div>

          {/* RIGHT SIDE */}
          {isOwner && (
            <button className="btn" onClick={() => setIsEditProjectOpen(true)}>
              Edit Project
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tasks</h2>

          <button className="btn" onClick={() => setIsTaskCreateOpen(true)}>
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
            setIsTaskDetailsOpen(true);
          }}
        />

        {/*
         * Task Details Modal
         */}
        <TaskDetailsModal
          // Pass selectedTask to modal
          task={selectedTask}
          // Set modal open state
          isOpen={isTaskDetailsOpen}
          // Close modal handler
          onClose={() => setIsTaskDetailsOpen(false)}
          // Checks if the current user is the owner
          isOwner={isOwner}
          // Checks if the current user is an the assigned user
          isAssignee={isAssignee}
          //   Handlers for edit and delete actions
          onEdit={() => {
            setIsTaskDetailsOpen(false);
            setIsTaskEditOpen(true);
          }}
          onDelete={() => {
            setIsTaskDetailsOpen(false);
            setIsTaskDeleteOpen(true);
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
            isOpen={isTaskEditOpen}
            onClose={() => setIsTaskEditOpen(false)}
          />
        )}

        {/*
         * Task Creation Modal
         */}
        <TaskFormModal
          projectId={projectId}
          isOpen={isTaskCreateOpen}
          onClose={() => setIsTaskCreateOpen(false)}
        />
        {/*
         * Confirm Delete Modal
         */}
        <ConfirmDeleteTaskModal
          isOpen={isTaskDeleteOpen}
          onClose={() => setIsTaskDeleteOpen(false)}
          onConfirm={handleDeleteTask}
        />

        {project && (
          <EditProjectModal
            project={project}
            isOpen={isEditProjectOpen}
            onClose={() => setIsEditProjectOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
