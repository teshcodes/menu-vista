import React, { useRef, useState, useEffect } from "react";
import { X, Trash2, RotateCcw, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface EditMenuModalProps {
  onClose: () => void;
  onSave: (menuData: {
    menuName: string;
    restaurant: { foodMenu: File | null; drinkMenu: File | null };
    spa: { spaMenu: File | null };
    reviewLink: string;
  }) => void;
  isSaving?: boolean;

  initialName?: string;
}

type UploadSlot = "foodMenu" | "drinkMenu" | "spaMenu";

const humanFileSize = (size: number) => {
  if (!size) return "0 B";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1) +
    " " +
    ["B", "KB", "MB", "GB"][i]
  );
};

export default function EditMenuModal({
  onClose,
  onSave,
  isSaving = false,
  initialName = "",
}: EditMenuModalProps) {
  // form state
  const [menuName, setMenuName] = useState("initialName");
  const [reviewLink, setReviewLink] = useState("");
  // const [description, setDescription] = useState("");

  useEffect(() => {
    setMenuName(initialName);
  }, [initialName]);

  // files and progress
  const [foodFile, setFoodFile] = useState<File | null>(null);
  const [drinkFile, setDrinkFile] = useState<File | null>(null);
  const [spaFile, setSpaFile] = useState<File | null>(null);

  const [foodProgress, setFoodProgress] = useState(0);
  const [drinkProgress, setDrinkProgress] = useState(0);
  const [spaProgress, setSpaProgress] = useState(0);

  const foodInputRef = useRef<HTMLInputElement | null>(null);
  const drinkInputRef = useRef<HTMLInputElement | null>(null);
  const spaInputRef = useRef<HTMLInputElement | null>(null);

  // CUSTOM SCROLLBAR LOGIC

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const totalScrollable = el.scrollHeight - el.clientHeight;

      if (totalScrollable <= 0) {
        setScrollPercent(0);
        return;
      }

      const percent = Math.min(
        100,
        Math.max(0, (el.scrollTop / totalScrollable) * 100)
      );

      setScrollPercent(percent);
    };

    el.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on mount
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);


  // small helpers
  const startFakeProgress = (setter: (n: number) => void) => {
    setter(0);
    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.floor(Math.random() * 12) + 6; // random step
      if (prog >= 100) {
        prog = 100;
        setter(prog);
        clearInterval(iv);
      } else {
        setter(Math.min(100, prog));
      }
    }, 200);
  };

  // file change handlers
  const onFileSelected = (slot: UploadSlot, file: File | null) => {
    if (!file) return;

    // small validation example (optional)
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      toast.error?.("Unsupported file type. Use PDF/JPG/PNG/SVG.");
      return;
    }

    if (slot === "foodMenu") {
      setFoodFile(file);
      startFakeProgress(setFoodProgress);
    } else if (slot === "drinkMenu") {
      setDrinkFile(file);
      startFakeProgress(setDrinkProgress);
    } else if (slot === "spaMenu") {
      setSpaFile(file);
      startFakeProgress(setSpaProgress);
    }
  };

  // wrapper for input change events
  const handleInputChange =
    (slot: UploadSlot) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null;
      onFileSelected(slot, f);
    };

  // remove file
  const removeFile = (slot: UploadSlot) => {
    if (slot === "foodMenu") {
      setFoodFile(null);
      setFoodProgress(0);
      if (foodInputRef.current) foodInputRef.current.value = "";
    } else if (slot === "drinkMenu") {
      setDrinkFile(null);
      setDrinkProgress(0);
      if (drinkInputRef.current) drinkInputRef.current.value = "";
    } else if (slot === "spaMenu") {
      setSpaFile(null);
      setSpaProgress(0);
      if (spaInputRef.current) spaInputRef.current.value = "";
    }
  };

  const replaceFile = (slot: UploadSlot) => {
    if (slot === "foodMenu") foodInputRef.current?.click();
    if (slot === "drinkMenu") drinkInputRef.current?.click();
    if (slot === "spaMenu") spaInputRef.current?.click();
  };

  // submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!menuName.trim()) {
      toast.error?.("Please provide a menu name.");
      return;
    }

    const hasAnyFile = foodFile || drinkFile || spaFile;
    if (!hasAnyFile) {
      toast.error?.("Please upload at least one menu file (Food, Drink, or Spa).");
      return;
    }
    const payload = {
      menuName: menuName.trim(),
      restaurant: {
        foodMenu: foodFile, drinkMenu: drinkFile
      },
      spa: { spaMenu: spaFile },
      reviewLink: reviewLink.trim(),
    };

    onSave(payload);
  };

  // small preview renderer
  const FilePreview: React.FC<{ file: File | null }> = ({ file }) => {
    if (!file) return null;
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type.includes("pdf");

    // Icon based on type
    const IconComponent = isImage ? ImageIcon : isPdf ? X : RotateCcw; // Using X as a basic file icon placeholder for simplicity

    return (
      <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center text-sm text-gray-600">
        <IconComponent size={18} className="text-[#5C2E1E]" />
      </div>
    );
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* modal */}
      <div className="relative z-50 w-[92%] max-w-lg bg-white rounded-xl shadow-xl">
        {/* header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 items-start">Edit " "</h3>
            <p className="text-sm text-gray-500 mt-1 text-start">
              Update your menu details or replace uploaded files. Existing QR codes automatically reflect your latest changes.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* body (scrollable) */}
        <form onSubmit={handleSubmit} className="px-6 pb-5 relative">
          {/* ---------------------------- */}
          {/* CUSTOM LEFT SCROLL INDICATOR */}
          {/* ---------------------------- */}
          <div className="absolute left-0 top-5 bottom-[70px] w-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="w-full bg-[#5C2E1E] rounded-full transition-all duration-150"
              style={{
                height: "18%",                      // dynamic size (premium feel)
                transform: `translateY(${scrollPercent}%)`,
                transition: "transform 0.2s linear"
              }}
            />
          </div>
          {/* ---------------------------- */}
          {/* SCROLLABLE BODY */}
          <div
            ref={scrollRef}
            className="max-h-[60vh] overflow-y-scroll pr-2 space-y-4 pt-4 no-scrollbar smooth-scroll scroll-fade"
          >
            {/* Menu Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">Menu Name</label>
              <input
                type="text"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                placeholder="Enter menu name"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2E1E]"
              />
            </div>

            {/* Restaurant Menus header */}
            <div className="flex items-center justify-between pt-4">
              <h4 className="text-sm font-medium text-gray-700">Restaurant Menus</h4>
            </div>

            {/* Food + Drink grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Food Menu upload card */}
              <div className="bg-gray-50 rounded-md border border-gray-100 p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Food Menu</p>
                </div>

                {/* if file exists show card, else show dropzone */}
                {foodFile ? (
                  <div className="border rounded-md p-3 bg-white">
                    <div className="flex items-start gap-3">
                      <FilePreview file={foodFile} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-800 truncate">{foodFile.name}</p>
                          <button onClick={() => removeFile("foodMenu")} type="button" className="text-gray-400 hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 text-start">{humanFileSize(foodFile.size)}</p>

                        {/* progress */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex-1 bg-gray-100 h-2 rounded-full">
                            <div className="h-2 bg-[#5C2E1E] rounded-full" style={{ width: `${foodProgress}%` }} />
                          </div>
                          <div className="text-xs text-gray-500">{foodProgress}%</div>
                        </div>

                        <div className="flex gap-3 mt-3 text-sm">
                          <button type="button" onClick={() => replaceFile("foodMenu")} className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
                            <RotateCcw size={14} /> Replace
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 rounded-md p-6 text-center text-sm text-gray-500 hover:bg-gray-50 h-full">
                    <input ref={foodInputRef} onChange={handleInputChange("foodMenu")} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" />
                    <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center">
                      <ImageIcon size={18} className="text-gray-400" />
                    </div>
                    <div>Click or drag and drop</div>
                    <div className="text-xs text-gray-400">PDF, PNG, or JPG</div>
                  </label>
                )}
              </div>

              {/* Drink Menu upload card */}
              <div className="bg-gray-50 rounded-md border border-gray-100 p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Drink Menu</p>
                </div>

                {drinkFile ? (
                  <div className="border rounded-md p-3 bg-white">
                    <div className="flex items-start gap-3">
                      <FilePreview file={drinkFile} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-800 truncate">{drinkFile.name}</p>
                          <button onClick={() => removeFile("drinkMenu")} type="button" className="text-gray-400 hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 text-start">{humanFileSize(drinkFile.size)}</p>

                        {/* progress */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex-1 bg-gray-100 h-2 rounded-full">
                            <div className="h-2 bg-[#5C2E1E] rounded-full" style={{ width: `${drinkProgress}%` }} />
                          </div>
                          <div className="text-xs text-gray-500">{drinkProgress}%</div>
                        </div>

                        <div className="flex gap-3 mt-3 text-sm">
                          <button type="button" onClick={() => replaceFile("drinkMenu")} className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
                            <RotateCcw size={14} /> Replace
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 rounded-md p-6 text-center text-sm text-gray-500 hover:bg-gray-50 h-full">
                    <input ref={drinkInputRef} onChange={handleInputChange("drinkMenu")} type="file" accept=".pdf,.png,.jpg,.jpeg,.svg" className="hidden" />
                    <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center">
                      <ImageIcon size={18} className="text-gray-400" />
                    </div>
                    <div>Click or drag and drop</div>
                    <div className="text-xs text-gray-400">PDF, PNG, JPG, or SVG (max. 800×400px)</div>
                  </label>
                )}
              </div>
            </div>

            {/* Spa Menu */}
            <div>
              <div className="flex items-center justify-between mb-2 pt-4">
                <h4 className="text-sm font-medium text-gray-700">Spa Menu</h4>
              </div>

              {spaFile ? (
                <div className="border rounded-md p-3 bg-white">
                  <div className="flex items-start gap-3">
                    <FilePreview file={spaFile} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-800 truncate">{spaFile.name}</p>
                        <button onClick={() => removeFile("spaMenu")} type="button" className="text-gray-400 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-start">{humanFileSize(spaFile.size)}</p>

                      {/* progress */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 bg-gray-100 h-2 rounded-full">
                          <div className="h-2 bg-[#5C2E1E] rounded-full" style={{ width: `${spaProgress}%` }} />
                        </div>
                        <div className="text-xs text-gray-500">{spaProgress}%</div>
                      </div>

                      <div className="flex gap-3 mt-3 text-sm">
                        <button type="button" onClick={() => replaceFile("spaMenu")} className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
                          <RotateCcw size={14} /> Replace
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 rounded-md p-6 text-center text-sm text-gray-500 hover:bg-gray-50">
                  <input ref={spaInputRef} onChange={handleInputChange("spaMenu")} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" />
                  <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center">
                    <ImageIcon size={18} className="text-gray-400" />
                  </div>
                  <div>Click or drag and drop</div>
                  <div className="text-xs text-gray-400">PDF, PNG, or JPG</div>
                </label>
              )}
            </div>

            {/* Review Link */}
            <div>
              <div className="flex items-center justify-between mb-2 pt-4">
                <h4 className="text-sm font-medium text-gray-700">Review Link</h4>
              </div>
              <input
                type="text"
                value={reviewLink}
                onChange={(e) => setReviewLink(e.target.value)}
                placeholder="Add a link to receive feedback from your customers"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5C2E1E]"
              />
              <p className="text-start text-xs text-blue-600 hover:text-blue-800 mt-2 cursor-pointer">Create your survey in Insite360 &rarr;</p>
            </div>


          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className={`px-5 py-2 rounded-md text-white ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-[#5C2E1E] hover:bg-[#4b2415]"}`}>
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}