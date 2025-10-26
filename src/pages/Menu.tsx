import { useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarNav from "../components/SidebarNav";
import UploadMenuModal from "../components/UploadMenuModal"

export default function MenuPage() {
  const [showTips, setShowTips] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSaveMenu = (menuData: { name: string; file: File | null }) => {
    // Here you can implement the actual save logic
    console.log('Saving menu:', menuData);
    setShowModal(false);
  };

  const toggleTips = () => setShowTips(!showTips);
  const closeTips = () => setShowTips(false);

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Desktop Sidebar (Sticky) */}
      <div className="hidden md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:block">
        <SidebarNav />
      </div>

      {/* Mobile Top Bar (Logo + Menu Button) */}
      <div className="md:hidden sticky top-0 z-50 bg-white shadow-sm flex items-center px-4 py-3">
        <img src="/logo.png" alt="Logo" className="h-8" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar (Slide-in) */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-md z-50 transform transition-transform duration-300">
            <SidebarNav />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:mt-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 mt-4 md:mt-0">
          <div>
            <h1 className="text-3xl font-semibold text-black mb-2 md:mb-0">
              Menus
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Upload a PDF or image of your menu. We’ll generate a menu link and
              QR code automatically.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-64 relative">
            <input
              type="text"
              placeholder="Search menu"
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2E1E] focus:border-transparent"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
              />
            </svg>
          </div>
        </div>

        {/* Upload Section */}
        <div className="flex flex-col items-center justify-center text-center py-16 relative">
          {/* Background lines */}
          <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 -mt-40">
            <div className="bg-[#F2F4F7] w-20 h-3 rounded-xl"></div>
            <div className="bg-[#F2F4F7] w-36 h-3 rounded-xl"></div>
            <div className="bg-[#F2F4F7] ml-8 w-28 h-3 rounded-xl"></div>
            <div className="bg-[#F2F4F7] w-36 mr-10 h-3 rounded-xl"></div>
            <div className="flex gap-1">
              <div className="bg-[#F2F4F7] w-30 h-3 rounded-xl"></div>
              <div className="bg-[#F2F4F7] w-3 h-3 rounded-full"></div>
            </div>
          </div>

          {/* Upload Icon */}
          <img
            src="/material-symbols.png"
            alt="Upload Icon"
            className="w-16 h-16 mb-4 opacity-90"
          />

          {/* Text */}
          <h2 className="text-lg font-semibold text-gray-800">No Menus Yet</h2>
          <p className="text-gray-600 text-sm mt-2">
            Upload your PDF or image menus and they'll be instantly available
            via QR codes.{" "}
            <span className="text-xs text-gray-500">Max size: 10MB</span>
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 relative">
            {/* Upload Button */}
            <button onClick={() => setShowModal(true) } className="flex items-center justify-center gap-2 bg-[#5C2E1B] text-white px-5 py-2.5 rounded-md hover:bg-[#4b2415] transition">
              <span className="text-lg font-bold">+</span> Upload my first menu
            </button>

            {showModal && <UploadMenuModal onClose={() => setShowModal(false)} onSave={handleSaveMenu} />}

            {/* Tips Dropdown */}
            <div className="relative group">
              <button
                className="bg-white border border-gray-300 text-gray-800 px-5 py-2.5 rounded-md hover:bg-gray-100 transition"
                onClick={toggleTips}
              >
                Tips
              </button>

              <div
                className={`absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 bg-white shadow-lg rounded-md border border-gray-200 p-4 text-start transition-all duration-300 z-30
                ${
                  showTips
                    ? "opacity-100 visible pointer-events-auto"
                    : "opacity-0 invisible pointer-events-none"
                }
                sm:opacity-0 sm:invisible sm:group-hover:opacity-100 sm:group-hover:visible sm:group-hover:pointer-events-auto
              `}
              >
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-3">
                  <li>
                    <span className="font-bold">File size:</span> PDFs under 1MB load fastest
                    on mobile devices.
                  </li>
                  <li>
                    <span className="font-bold">Formats:</span> Supported file types are PDF,
                    JPG, and PNG.
                  </li>
                  <li>
                    <span className="font-bold">Naming:</span> Use clear menu names like
                    "Breakfast" or "Dinner Specials."
                  </li>
                  <li>
                    <span className="font-bold">Updating:</span> You can replace menu file
                    anytime — QR codes stay linked.
                  </li>
                  <li>
                    <span className="font-bold">Readability:</span> Use text that’s at least
                    12pt for easy reading on mobile.
                  </li>
                </ul>
              </div>
            </div>

            {/* Overlay for mobile tap outside */}
            {showTips && (
              <div
                className="fixed inset-0 z-20 sm:hidden"
                onClick={closeTips}
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
