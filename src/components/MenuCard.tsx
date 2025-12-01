import { FaTrash, FaEdit, FaQrcode, FaEye, FaFilePdf, FaImage } from "react-icons/fa";

interface MenuFile {
  name: string;
  type: "PDF" | "IMG";
  url: string;
  size?: number; // size in bytes
}

interface MenuCardProps {
  name: string;
  files: MenuFile[];
  date: string;
  onView: () => void;
  onEdit: () => void;
  onQR: () => void;
  onDelete?: () => void;
}

export default function MenuCard({
  name,
  files,
  date,
  onView,
  onEdit,
  onQR,
  onDelete,
}: MenuCardProps) {
  // Determine overall type
  const hasPDF = files.some(f => f.type === "PDF");
  const hasIMG = files.some(f => f.type === "IMG");
  const fileType: "PDF" | "IMG" | "MIXED" = hasPDF && hasIMG ? "MIXED" : hasPDF ? "PDF" : "IMG";

  // Compute total size in MB
  const totalSizeBytes = files.reduce((sum, f) => sum + (f.size ?? 0), 0);
  const fileSizeDisplay = totalSizeBytes > 0
    ? `${(totalSizeBytes / (1024 * 1024)).toFixed(2)} MB`
    : "Unknown size";

  return (
    <div className="relative group">
      <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between
        transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:-translate-y-1 hover:z-50">

        {/* Header */}
        <div className="text-end mb-2">
          {onDelete && (
            <button onClick={onDelete} className="text-gray-400 hover:text-red-500 transition">
              <FaTrash size={14} />
            </button>
          )}
        </div>

        {/* File Info */}
        <div className="flex items-center gap-3 mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-2 truncate" title={name} style={{ maxWidth: '170px' }}>
              {name}
            </h3>

            <p className="text-xs text-gray-500 flex items-center gap-1">
              {fileType === "PDF" && <FaFilePdf size={12} />}
              {fileType === "IMG" && <FaImage size={12} />}
              {fileType === "MIXED" && <span>Mixed</span>}
              • {date} • {fileSizeDisplay}
            </p>

            {/* Show individual files if mixed */}
            {fileType === "MIXED" && files.length > 0 && (
              <div className="mt-1 text-xs text-gray-400">
                {files.map((f, i) => (
                  <div key={i}>
                    {f.name} ({f.type}) - {f.size ? `${(f.size / (1024 * 1024)).toFixed(2)} MB` : "Unknown"})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-3">
          <button onClick={onView} className="flex items-center justify-center gap-1 border border-gray-300 rounded-md py-1.5 px-1 text-xs text-gray-700 hover:bg-gray-100 transition">
            <FaEye size={15} /> View
          </button>

          <button onClick={onEdit} className="flex items-center justify-center gap-1 border border-gray-300 rounded-md py-1.5 px-1 text-xs text-gray-700 hover:bg-gray-100 transition">
            <FaEdit size={15} /> Edit
          </button>

          <button onClick={onQR} className="col-span-2 flex items-center justify-center gap-1 bg-[#5C2E1E] text-white rounded-md py-1.5 px-1 text-xs hover:bg-[#4a2516] transition">
            <FaQrcode size={15} /> QR
          </button>
        </div>
      </div>
    </div>
  );
}
