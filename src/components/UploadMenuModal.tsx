import { useRef, useState } from "react";
import { X, Trash2, RotateCcw, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface UploadMenuModalProps {
  onClose: () => void;
  onSave: (menuData: {
    name: string;
    description?: string;
    category?: string;
    type: "PDF" | "IMG";
    file: File;
  }) => void;
  isSaving?: boolean;
}

export default function UploadMenuModal({
  onClose,
  onSave,
  isSaving = false,
}: UploadMenuModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [menuName, setMenuName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -----------------------
  // Handle Form Submit
  // -----------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submit fired"); // debug: confirms button triggers

    if (!file || !menuName.trim()) {
      toast.error("Please provide a menu name and a file.");
      return;
    }

    const type: "PDF" | "IMG" = file.type.includes("pdf") ? "PDF" : "IMG";

    onSave({
      name: menuName,
      description,
      category,
      type,
      file,
    });
  };

  // -----------------------
  // Handle File Selection
  // -----------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected) {
      setFile(selected);
      setUploadProgress(0);

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 200);
    }
  };

  const handleReplaceClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 z-50">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Create New Menu</h2>
          <button onClick={onClose}>
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-start">
          {/* Menu Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Menu Name</label>
            <input
              type="text"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="Enter menu name"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category (optional)"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload Menu</label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.png"
              className="hidden"
              onChange={handleFileChange}
            />

            {file ? (
              <div className="border rounded-md p-3 flex items-center justify-between">
                <div className="ml-3 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 max-w-full">
                      <ImageIcon className="text-[#5C2E1E]" size={18} />
                      <p className="text-sm truncate max-w-[200px]">{file.name}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-gray-100 h-2 rounded-full">
                      <div
                        className="h-2 bg-[#5C2E1E] rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{uploadProgress}%</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleReplaceClick}
                    className="flex items-center gap-1 mt-2 text-sm text-gray-600"
                  >
                    <RotateCcw size={14} /> Replace file
                  </button>
                </div>
              </div>
            ) : (
              <label className="border border-dashed rounded-md px-4 py-8 text-center block cursor-pointer">
                <p className="text-sm">Click to upload your menu (PDF, JPG, PNG)</p>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="border px-4 py-2">
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className={`px-5 py-2 text-white rounded-md ${
                isSaving ? "bg-gray-400" : "bg-[#5C2E1E]"
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
