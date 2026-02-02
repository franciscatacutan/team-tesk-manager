import { useState } from "react";
import TaskList from "../tasks/TaskList";
import type { Task } from "../tasks/task.types";
import TaskDetailsModal from "../tasks/TaskDetailsModal";
import TaskEditModal from "../tasks/EditTaskModal";
import { useUpdateTask } from "../tasks/useUpdateTask";
import TaskFormModal from "../tasks/CreateTaskModal";
import { getCurrentUserFromToken } from "../auth/auth.utils";
import ConfirmDeleteTaskModal from "../tasks/ConfirmDeleteTaskModal";
import { useDeleteTask } from "../tasks/useDeleteTask";
import { useParams } from "react-router-dom";
import { useProjectById } from "../projects/useProjects";
import EditProjectModal from "../projects/EditProjectModal";
import { useDeleteProject } from "../projects/useDeleteProject";
import ConfirmDeleteProjectModal from "../projects/ConfirmDeleteProjectModal";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

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
  const [showDeleteProject, setShowDeleteProject] = useState(false);

  // Delete Project
  const deleteProject = useDeleteProject();
  const navigate = useNavigate();

  //Fetch Project Data
  const { id } = useParams();
  const projectId = Number(id);

  // Fetch project and owner
  const { data: project } = useProjectById(projectId);
  const projectOwnerEmail: string = project?.owner.email;

  // Update Task
  const updateTask = useUpdateTask(projectId, selectedTask?.id || 0);
  // Delete Task
  const deleteTask = useDeleteTask();

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

  // Handles Delete Project
  const handleDeleteProject = () => {
    if (!project) return;

    deleteProject.mutate(project.id, {
      onSuccess: () => {
        setShowDeleteProject(false);
        navigate("/projects");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* LEFT */}
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                {project?.name}
              </h1>

              {project?.description?.trim() && (
                <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
                  {project.description}
                </p>
              )}

              {/* Owner */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {/* Avatar */}
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700">
                  {project?.owner.firstName?.[0]}
                </div>

                <span className="font-medium text-gray-700">
                  {project?.owner.firstName} {project?.owner.lastName}
                </span>
              </div>
            </div>

            {/* RIGHT */}
            {isOwner && (
              <div className="flex items-center gap-2">
                <Button
                  size="md"
                  variant="secondary"
                  onClick={() => setIsEditProjectOpen(true)}
                >
                  Edit
                </Button>

                <Button
                  size="md"
                  variant="danger"
                  onClick={() => setShowDeleteProject(true)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsTaskCreateOpen(true)}
          >
            + Add Task
          </Button>
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
            projectId={projectId}
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
         * Confirm Task Delete Modal
         */}
        <ConfirmDeleteTaskModal
          isOpen={isTaskDeleteOpen}
          onClose={() => setIsTaskDeleteOpen(false)}
          onConfirm={handleDeleteTask}
        />

        {/*
         * Project Edit Modal
         */}
        {project && (
          <EditProjectModal
            project={project}
            isOpen={isEditProjectOpen}
            onClose={() => setIsEditProjectOpen(false)}
          />
        )}

        {/*
         * Confirm Project Delete Modal
         */}
        <ConfirmDeleteProjectModal
          isOpen={showDeleteProject}
          onClose={() => setShowDeleteProject(false)}
          onConfirm={handleDeleteProject}
        />
      </main>
    </div>
  );
}
