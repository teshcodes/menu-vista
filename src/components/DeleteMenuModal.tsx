import { FaExclamationCircle } from "react-icons/fa";

interface DeleteMenuModalProps {
  menuName: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteMenuModal({
  menuName,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteMenuModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-50 p-4 rounded-full">
          <div className="bg-red-100 text-red-600 p-3 rounded-full">
            <FaExclamationCircle size={20} />
          </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
          Delete Menu
        </h2>
        <p className="text-gray-500 text-center text-sm mb-1">
          Are you sure you want to delete the <strong>'{menuName}'</strong> menu?
        </p>
        <p className="text-gray-500 text-center text-sm mb-4">This action will remove the menu and its QR link</p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
