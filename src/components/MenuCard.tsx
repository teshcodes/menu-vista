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
  // Select icon based on file type
  const icon = (
    <img
      src={
        fileType === "PDF"
          ? "/type-icons.png"
          : fileType === "IMG"
          ? "/type-icons-2.png"
          : "/type-icons-3.png"
      }
      alt={`${fileType} icon`}
      className=" object-contain"
    />
  );

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
      {/* Header (icon + delete) */}
      <div className="flex justify-between mb-2">
        <div className="rounded-lg">{icon}</div>
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
          <h3 className="font-semibold text-gray-900 text-sm truncate mb-2">
            {name}
          </h3>
          <p className="text-xs text-gray-500">
            {fileType} • {date} • {fileSize}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-2 mt-3">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-1 border border-gray-300 rounded-md py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          <FaEye size={15} />
          View
        </button>

        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1 border border-gray-300 rounded-md py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          <FaEdit size={15} />
          Edit
        </button>

        <button
          onClick={onQR}
          className="flex-1 flex items-center justify-center gap-1 bg-[#5C2E1E] text-white rounded-md py-1.5 text-sm hover:bg-[#4a2516] transition"
        >
          <FaQrcode size={15} />
          QR
        </button>
      </div>
    </div>
  );
}
