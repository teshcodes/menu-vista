import { useState } from "react";
import SidebarNav from "../components/SidebarNav";
import UploadMenuModal from "../components/UploadMenuModal";
import { useCreateMenu } from "../hooks/useCreateMenu";
import { useDeleteMenu } from "../hooks/useDeleteMenu";
import MenuCard from "../components/MenuCard";
import DeleteMenuModal from "../components/DeleteMenuModal";
// import { FaUpload } from "react-icons/fa";

export default function Menu() {
  const [showTips, setShowTips] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [selectedMenuName, setSelectedMenuName] = useState<string>("");


  const { mutate: createMenu, isLoading: creating } = useCreateMenu();
  const { mutate: deleteMenuMutation, isPending: deleting } = useDeleteMenu();

  const menus: Array<{
    name: string;
    fileType: "PDF" | "IMG";
    fileSize: string;
    date: string;
  }> = [
      { name: "Buffet", fileType: "PDF", fileSize: "0.4MB", date: "Oct 5, 2025" },
      { name: "Brunch", fileType: "IMG", fileSize: "0.1MB", date: "Oct 5, 2025" },
      { name: "Dinner", fileType: "PDF", fileSize: "0.4MB", date: "Oct 5, 2025" },
      { name: "Iftar", fileType: "IMG", fileSize: "0.7MB", date: "Oct 7, 2025" },
    ];

  const handleSaveMenu = (menuData: { name: string; file: File | null; location?: string }) => {
    if (!menuData.file) {
      alert("Please upload a menu file before saving.");
      return;
    }

    const formData = new FormData();
    formData.append("name", menuData.name || "Untitled Menu");
    if (menuData.location) formData.append("location", menuData.location);
    formData.append("file", menuData.file);

    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    createMenu(
      { menuData: formData, token },
      {
        onSuccess: () => {
          setShowModal(false);
          alert("Menu uploaded successfully!");
        },
        onError: (err) => {
          console.error("Menu creation failed:", err);
          alert("Failed to upload menu. Please check your token or try again.");
        },
      }
    );
  };

  const handleDeleteMenu = (menuId: string, menuName: string) => {
    setSelectedMenuId(menuId);
    setSelectedMenuName(menuName);
    setShowDeleteModal(true);
  };

  const confirmDeleteMenu = () => {
    if (!selectedMenuId) {
      console.error("No menu selected for deletion");
      return;
    }

    deleteMenuMutation(
      { id: selectedMenuId },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedMenuId(null);
          setSelectedMenuName("");
        }
      }
    );
  };

  const toggleTips = () => setShowTips((prev) => !prev);
  const closeTips = () => setShowTips(false);

  const renderUploadModal = () =>
    showModal && (
      <UploadMenuModal
        onClose={() => setShowModal(false)}
        onSave={handleSaveMenu}
        isSaving={creating}
      />
    );

  const renderUploadSection = () => (
    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition mb-10 group">
      <div className="flex items-center justify-center h-full w-full mb-3">
        <img src="/upload-cloud.png" alt="Upload Cloud" />
      </div>

      <p className="text-gray-500">
        <span className="text-[#5C2E1B] cursor-pointer hover:underline">Click to Upload</span> or
        drag and drop a new menu
      </p>
      <p className="text-gray-500 text-sm mt-2">
        Upload your PDF or image menus and they'll be instantly available via QR codes.{" "}
        <span className="text-xs text-gray-400">Max Size: 10MB</span>
      </p>

      {/* Upload Icon Button - visible on hover/focus for desktop (md+) with blurred backdrop */}
      <button
        onClick={() => setShowModal(true)}
        aria-label="Upload new menu"
        className="hidden md:group-hover:flex md:group-focus:flex absolute bottom-4 right-4 items-center justify-center bg-white/60 backdrop-blur-sm shadow-xl rounded-lg p-3 hover:bg-white/70 transition"
      >
        <img src="/file-icon.png" alt="Upload" className="w-6 h-6 filter saturate-150" />
      </button>

      {/* Upload Icon Button - always visible on small screens with blurred background */}
      <button
        onClick={() => setShowModal(true)}
        aria-label="Upload new menu"
        className="flex md:hidden mt-4 mx-auto items-center justify-center bg-white/60 backdrop-blur-sm shadow-md p-2 rounded-full transition"
      >
        <img src="/file-icon.png" alt="Upload" className="w-6 h-6 filter saturate-150" />
      </button>

      {renderUploadModal()}
    </div>
  );

  const renderMenuGrid = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          My Menus{" "}
          <span className="ml-2 text-xs bg-[#EAD7C4] text-[#5C2E1E] px-2 py-0.5 rounded-md">
            {menus.length}
          </span>
        </h2>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#5C2E1E]"
          >
            <option value="All">Filter by: All</option>
            <option value="PDF">PDF</option>
            <option value="IMG">Image</option>
            <option value="Recent">Recent</option>
          </select>

          <svg
            className="absolute right-3 top-3 w-3 h-4 text-gray-500 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {menus.map((menu, i) => (
          <MenuCard
            key={i}
            {...menu}
            onView={() => console.log("View menu:", menu.name)}
            onEdit={() => console.log("Edit menu:", menu.name)}
            onQR={() => console.log("Generate QR for:", menu.name)}
            onDelete={() => handleDeleteMenu(menu.name, menu.name)} // you can replace with actual menu id later
          />
        ))}
      </div>
    </div>
  );

  const renderEmptyState = () => (
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
      <img src="/material-symbols.png" alt="Upload Icon" className="w-16 h-16 mb-4 opacity-90" />

      {/* Text */}
      <h2 className="text-lg font-semibold text-gray-800">No Menus Yet</h2>
      <p className="text-gray-600 text-sm mt-2">
        Upload your PDF or image menus and they'll be instantly available via QR codes.{" "}
        <span className="text-xs text-gray-500">Max size: 10MB</span>
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 relative">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-[#5C2E1B] text-white px-5 py-2.5 rounded-md hover:bg-[#4b2415] transition"
        >
          <span className="text-lg font-bold">+</span> Upload my first menu
        </button>

        {renderUploadModal()}


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
              ${showTips
                ? "opacity-100 visible pointer-events-auto"
                : "opacity-0 invisible pointer-events-none"
              }
              sm:opacity-0 sm:invisible sm:group-hover:opacity-100 sm:group-hover:visible sm:group-hover:pointer-events-auto
            `}
          >
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-3">
              <li>
                <span className="font-bold">File size:</span> PDFs under 1MB load fastest on mobile
                devices.
              </li>
              <li>
                <span className="font-bold">Formats:</span> Supported file types are PDF, JPG, and
                PNG.
              </li>
              <li>
                <span className="font-bold">Naming:</span> Use clear menu names like "Breakfast" or
                "Dinner Specials."
              </li>
              <li>
                <span className="font-bold">Updating:</span> You can replace menu file anytime — QR
                codes stay linked.
              </li>
              <li>
                <span className="font-bold">Readability:</span> Use text that’s at least 12pt for
                easy reading on mobile.
              </li>
            </ul>
          </div>
        </div>

        {showTips && <div className="fixed inset-0 z-20 sm:hidden" onClick={closeTips}></div>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SidebarNav />
      <div className="flex-1 overflow-y-auto p-6 md:mt-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 mt-4 md:mt-0">
          <div>
            <h1 className="text-3xl font-semibold text-black mb-2 md:mb-0">Menus</h1>
            <p className="text-gray-600 text-sm mt-1">
              Upload a PDF or image of your menu. We’ll generate a menu link and QR code
              automatically.
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

        {/* Upload zone */}
        {renderUploadSection()}

        {/* Menus or Empty State */}
        {menus.length > 0 ? renderMenuGrid() : renderEmptyState()}

        {showDeleteModal && (
          <DeleteMenuModal
            menuName={selectedMenuName}
            isDeleting={deleting}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDeleteMenu}
          />
        )}
      </div>
    </div>
  );
}
