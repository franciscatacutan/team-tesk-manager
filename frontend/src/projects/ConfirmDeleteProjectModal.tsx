import Modal from "../components/Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};
/*
 * Delete Project Modal
 */
export default function ConfirmDeleteProjectModal({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-2">Delete Project</h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this project? All tasks inside this
        project will also be removed.
      </p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="btn bg-gray-200 text-black"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="button"
          className="btn bg-red-600 hover:bg-red-700"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
