import { FaTrash, FaEdit, FaQrcode, FaEye } from "react-icons/fa";

interface MenuCardProps {
  name: string;
  fileType: "PDF" | "IMG";
  fileSize: string;
  date: string;
  onView: () => void;
  onEdit: () => void;
  onQR: () => void;
  onDelete?: () => void;
}

export default function MenuCard({
  name,
  fileType,
  fileSize,
  date,
  onView,
  onEdit,
  onQR,
  onDelete,
}: MenuCardProps) {

  return (
    <div className="relative">

      {/* Glass reflection layer (only visible when hovered) */}
      <div
        className="
     relative bg-white border border-gray-200 rounded-xl shadow-sm p-4
    flex flex-col justify-between

    transition-all duration-300
    hover:scale-[1.04]
    hover:shadow-xl
    hover:-translate-y-1
    hover:z-50
  "
      >
        {/* Reflection Glass Layer */}
        <div
          className="
      absolute -bottom-3 left-2 right-2 h-4
      opacity-0 group-hover:opacity-100
      transition-all duration-300

      bg-linear-to-b from-white/20 to-white/0
      backdrop-blur-md
      rounded-xl
      pointer-events-none
    "
        ></div>

        {/* Header */}
        <div className="text-end mb-2">
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <FaTrash size={14} />
            </button>
          )}
        </div>

        {/* File Info */}
        <div className="flex items-center gap-3 mb-3">
          <div>
            <h3
              className="font-semibold text-gray-900 text-sm mb-2 truncate"
              title={name}
              style={{ maxWidth: '170px' }}
            >
              {name}
            </h3>

            <p className="text-xs text-gray-500">
              {fileType} • {date} • {fileSize}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-3">
          <button
            onClick={onView}
            className="flex items-center justify-center gap-1 border border-gray-300 rounded-md py-1.5 px-1 text-xs text-gray-700 hover:bg-gray-100 transition"
          >
            <FaEye size={15} />
            View
          </button>

          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-1 border border-gray-300 rounded-md py-1.5 px-1 text-xs text-gray-700 hover:bg-gray-100 transition"
          >
            <FaEdit size={15} />
            Edit
          </button>

          <button
            onClick={onQR}
            className="col-span-2 flex items-center justify-center gap-1 bg-[#5C2E1E] text-white rounded-md py-1.5 px-1 text-xs hover:bg-[#4a2516] transition"
          >
            <FaQrcode size={15} />
            QR
          </button>
        </div>
      </div>

    </div>
  );
}
