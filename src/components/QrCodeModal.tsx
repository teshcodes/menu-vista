import { useState, useRef } from "react";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";

interface QrCodeModalProps {
  onClose: () => void;
  menuName: string;
  qrUrl: string;
}

export default function QrCodeModal({
  onClose,
  menuName,
  qrUrl,
}: QrCodeModalProps) {
  const [backgroundMode, setBackgroundMode] = useState<
    "image" | "cubes" | "transparent"
  >("image");

  const [customBg, setCustomBg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultImage = "/qr-bg.jpg";

  const currentBg = backgroundMode === "image" ? customBg || defaultImage : null;

  const handleChangeImage = () => fileInputRef.current?.click();

  const textColor = backgroundMode === "transparent" ? "text-black" : "text-white";

  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!previewRef.current) return;

    toPng(previewRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${menuName}-qr.png`;
        link.href = dataUrl;
        link.click();
        toast.success("PNG downloaded!");
      })
      .catch(() => toast.error("Failed to download image"));
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(qrUrl);
    toast.success("Link copied!");
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setCustomBg(reader.result as string);
    reader.readAsDataURL(file);
  };

  /** CUBE BACKGROUND GENERATOR */
  function CubeBackground() {
    const colors = ["#FBBF24", "#D97706", "#B45309", "#92400E"]; // you can edit

    const squares = Array.from({ length: 200 }, (_, i) => (
      <div
        key={i}
        className="w-5 h-5"
        style={{ backgroundColor: colors[Math.floor(Math.random() * colors.length)] }}
      ></div>
    ));

    return (
      <div className="absolute inset-0 grid grid-cols-10 gap-0">
        {squares}
      </div>
    );
  }

  return (
    // OUTER CONTAINER: Keep fixed for centering and backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* HIDDEN INPUT */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* MODAL: Added h-[95%] and overflow-y-auto for mobile scrolling. 
          md:h-auto and md:overflow-hidden maintain the desktop fixed look. */}
      <div className="relative bg-white rounded-xl shadow-xl w-[95%] max-w-5xl z-50 overflow-hidden h-[95%] md:h-auto overflow-y-auto md:overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            QR Code for {menuName}
          </h1>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* CONTENT LAYOUT */}
        {/* On mobile, this will scroll within the constrained modal height */}
        <div className="flex flex-col md:flex-row">
          {/* LEFT SIDE OPTIONS */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 p-6 space-y-6">
            <h3 className="text-lg font-semibold">Options</h3>

            {/* BG OPTIONS */}
            <div className="space-y-4">
              {/* Image Background */}
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="radio"
                  name="bg"
                  checked={backgroundMode === "image"}
                  onChange={() => setBackgroundMode("image")}
                  className="h-4 w-4 text-amber-900 focus:ring-amber-900"
                />
                Image background
                {backgroundMode === "image" && (
                  <button
                    onClick={handleChangeImage}
                    className="ml-1 text-amber-700 underline hover:text-amber-800"
                  >
                    change image
                  </button>
                )}
              </label>

              {/* Cube Pattern */}
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="radio"
                  name="bg"
                  checked={backgroundMode === "cubes"}
                  onChange={() => setBackgroundMode("cubes")}
                  className="h-4 w-4 text-amber-900 focus:ring-amber-900"
                />
                Transparent (color cubes)
              </label>

              {/* Fully Transparent */}
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="radio"
                  name="bg"
                  checked={backgroundMode === "transparent"}
                  onChange={() => setBackgroundMode("transparent")}
                  className="h-4 w-4 text-amber-900 focus:ring-amber-900"
                />
                Fully transparent
              </label>
            </div>

            {/* RESOLUTION */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Resolution</h3>
              <div className="relative w-full max-w-xs">
                <select className="w-full border border-gray-300 py-2 px-4 rounded appearance-none text-gray-700 focus:outline-none focus:border-amber-900">
                  <option>1200px (print)</option>
                  <option>600px (web)</option>
                </select>
                <ChevronDownIcon className="absolute right-2 top-3 w-4 h-4 text-gray-600" />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="space-y-3">
              <button
                onClick={handleDownload}
                className="w-full bg-amber-800 text-white py-2 rounded shadow hover:bg-amber-900 transition"
              >
                Download PNG
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full bg-amber-50 text-amber-900 py-2 rounded border border-amber-200 shadow hover:bg-amber-100 transition"
              >
                Copy Link
              </button>

            </div>

            {/* TIP */}
            <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Tip: </strong>
              Use Image background for print, Transparent or Cubes for clean modern look.
            </p>
          </div>

          {/* RIGHT PREVIEW */}
          <div className="flex-1 flex justify-center items-center bg-gray-50 p-6">
            <div
              ref={previewRef}
              className="relative w-full max-w-sm rounded overflow-hidden shadow-xl"
            >
              {/* CONDITIONAL BACKGROUND */}
              {backgroundMode === "cubes" && (
                <>
                  <CubeBackground />
                  <div className="absolute inset-0 bg-black/20"></div>
                </>
              )}

              {backgroundMode === "image" && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${currentBg})` }}
                ></div>
              )}

              {/* CONTENT */}
              <div className="relative z-10 flex flex-col items-center p-4">
                {/* LOGO - Inverted to white */}
                <img
                  src="/logo-white.png"
                  className="w-28 h-16 invert"
                />

                <p className={`${textColor} text-lg font-bold mb-4 -mt-2`}>
                  Scan for {menuName} Menu
                </p>


                <div className="w-60 h-60 bg-white p-2 rounded-md shadow-lg flex items-center justify-center">
                  <QRCode value={qrUrl} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}