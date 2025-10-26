import { useRef, useState } from "react";
import { X, Trash2, RotateCcw, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UploadMenuModalProps {
  onClose: () => void;
  onSave: (menu: { name: string; file: File | null }) => void;
}

export default function UploadMenuModal({ onClose, onSave }: UploadMenuModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [menuName, setMenuName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name: menuName || "Untitled Menu", file });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      // Reset progress each time a new file is selected
      setUploadProgress(0);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 200);
    }
  };

  // Trigger file input (for Replace)
  const handleReplaceClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // clear previous file
      fileInputRef.current.click(); // open file picker
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Blur */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 z-50">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Create New Menu</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-start">
          {/* Menu Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menu Name
            </label>
            <input
              type="text"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="Enter menu name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2E1E]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter location"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2E1E]"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Menu
            </label>

            {/* Hidden Input (used for both upload & replace) */}
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />

            {file ? (
              <div className="border border-gray-200 rounded-md p-3 flex items-center justify-between">
                {/* Left Section - File Info */}
                <div className="ml-3 w-full">
                  {/* File Name + Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="text-[#5C2E1E]" size={18} />
                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
                    </div>

                    {/* Delete Icon */}
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setUploadProgress(0);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* File Size */}
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>

                  {/* Progress Bar + Percentage */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-gray-100 h-2 rounded-full">
                      <div
                        className="h-2 bg-[#5C2E1E] rounded-full transition-all duration-1000"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 w-8 text-right">
                      {uploadProgress}%
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleReplaceClick}
                    className="flex items-center gap-1 text-sm text-gray-600 mt-2 hover:text-[#5C2E1E] transition"
                  >
                    <RotateCcw size={14} />
                    Replace image
                  </button>
                </div>
              </div>
            ) : (
              <label className="border border-dashed border-gray-300 rounded-md px-4 py-8 text-center block cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-sm text-gray-600">
                  Click to upload your menu (PDF, JPG, PNG)
                </p>
              </label>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {navigate("/menupage");}}
              className="px-5 py-2 rounded-md bg-[#5C2E1E] text-white hover:bg-[#4b2415]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
