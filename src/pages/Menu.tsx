import { useState } from "react";
import SidebarNav from "../components/SidebarNav";
import UploadMenuModal from "../components/UploadMenuModal";
import DeleteMenuModal from "../components/DeleteMenuModal";
import EditMenuModal from "../components/EditMenuModal";
import MenuCard from "../components/MenuCard";
import { useCreateMenu } from "../hooks/useCreateMenu";
import { useDeleteMenu } from "../hooks/useDeleteMenu";
import { useUpdateMenu } from "../hooks/useUpdateMenu";
import { useGetMenus } from "../hooks/useGetMenus";
import { toast } from "sonner";

interface MenuItem {
  id?: string;
  name: string;
  fileType: "PDF" | "IMG";
  fileSize: number;
  createdAt: string;
  date: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  type?: "PDF" | "IMG";
}

export default function Menu() {
  // --- State ---
  const [showTips, setShowTips] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [filter, setFilter] = useState("All");
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [selectedMenuName, setSelectedMenuName] = useState<string>("");

  // --- Hooks ---
  const { mutate: createMenu, isLoading: creating } = useCreateMenu();
  const { mutate: deleteMenuMutation, isPending: deleting } = useDeleteMenu();
  const { mutate: updateMenu, isPending: updating } = useUpdateMenu();

   

  const { data: menuData, isLoading, isError } = useGetMenus({
    skip: 0,
    take: 20,
  });


  if (isLoading) return <p className="p-6">Loading menus...</p>;
  if (isError) return <p className="p-6 text-red-600">Failed to fetch menus. Please check your token.</p>;

   


  // --- Handlers ---
  const handleSaveMenu = (menuData: {
    name: string;
    file: File;
    type: string;
    description?: string;
    category?: string;
  }) => {
    if (!menuData.file) {
      toast.error("Please upload a menu file.");
      return;
    }

    const MAX_FILE_SIZE_MB = 10;

    if (menuData.file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
      toast.error(`File size should not exceed ${MAX_FILE_SIZE_MB} MB`);
      return;
    }

    const token = localStorage.getItem("authToken") ?? localStorage.getItem("token");

    // Convert to FormData for backend
    const formData = new FormData();
    formData.append("name", menuData.name);
    formData.append("type", menuData.type); // PDF or IMG
    formData.append("file", menuData.file);
    if (menuData.description) formData.append("description", menuData.description);
    if (menuData.category) formData.append("category", menuData.category);

    createMenu(
      { menuData: formData, token },
      {
        onSuccess: () => {
          setShowUploadModal(false);
          toast.success("Menu uploaded successfully!");
        },
        onError: (err) => {
          console.error(err);
          toast.error("Failed to upload menu.");
        },
      }
    );
  };

  const handleEditMenu = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setShowEditModal(true);

  };

  const handleSaveEdit = (updatedData: {
    name: string;
    file?: File | null;
    location?: string;
    description?: string;
    category?: string;
  }) => {
    if (!selectedMenu) return;

    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("name", updatedData.name || selectedMenu.name);
    if (updatedData.category) formData.append("category", updatedData.category);
    if (updatedData.description) formData.append("description", updatedData.description);
    if (updatedData.location) formData.append("location", updatedData.location);
    if (updatedData.file) formData.append("file", updatedData.file);

    updateMenu(
      { id: selectedMenu.id!, data: formData, token },
      {
        onSuccess: () => {
          toast.success("Menu updated successfully!");
          setShowEditModal(false);
          setSelectedMenu(null);
        },
        onError: (error) => {
          console.error("Update failed:", error);
          toast.error("Failed to update menu. Please check your token or try again.");
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
          toast.success("Menu deleted successfully!");
        },
      }
    );
  };


    // --- Tips ---
    const toggleTips = () => setShowTips((prev) => !prev);
    const closeTips = () => setShowTips(false);

    // --- Render Sections ---
    const renderUploadSection = () => (
      <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition mb-10 group">
        <div className="flex items-center justify-center h-full w-full mb-3">
          <img src="/upload-cloud.png" alt="Upload Cloud" />
        </div>

        <p className="text-gray-500">
          <span
            className="text-[#5C2E1B] cursor-pointer hover:underline"
            onClick={() => setShowUploadModal(true)}
          >
            Click to Upload
          </span>{" "}
          or drag and drop a new menu
        </p>

        <p className="text-gray-500 text-sm mt-2">
          Upload your PDF or image menus and they'll be instantly available via QR codes.{" "}
          <span className="text-xs text-gray-400">Max Size: 10MB</span>
        </p>

        {/* Upload Icon Button */}
        <button
          onClick={() => setShowUploadModal(true)}
          aria-label="Upload new menu"
          className="hidden md:group-hover:flex absolute bottom-4 right-4 items-center justify-center bg-white/60 backdrop-blur-sm shadow-xl rounded-lg p-3 hover:bg-white/70 transition"
        >
          <img src="/file-icon.png" alt="Upload" className="w-6 h-6 filter saturate-150" />
        </button>

        {showUploadModal && (
          <UploadMenuModal
            onClose={() => setShowUploadModal(false)}
            onSave={handleSaveMenu}
            isSaving={creating}
          />
        )}
      </div>
    );

  const renderMenuGrid = () => {
    const menus = menuData || [];

    return (
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
              className="border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm bg-white"
            >
              <option value="All">Filter by: All</option>
              <option value="PDF">PDF</option>
              <option value="IMG">Image</option>
              <option value="Recent">Recent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {menus.length > 0 ? (
            menus.map((menu: MenuItem) => (
              <MenuCard
                key={menu.id}
                name={menu.name}
                fileType={menu.type || "PDF"}
                date={new Date(menu.createdAt).toLocaleDateString()}
                fileSize={`${Math.min(menu.fileSize / (1024 * 1024), 10).toFixed(2)} MB`}
                onView={() => console.log("View menu:", menu.name)}
                onEdit={() => handleEditMenu(menu)}
                onQR={() => console.log("Generate QR for:", menu.name)}
                onDelete={() => handleDeleteMenu(menu.id || "", menu.name)}
              />
            ))
          ) : (
            renderEmptyState()
          )}
        </div>
      </div>
    );
};


    const renderEmptyState = () => (
      <div className="flex flex-col items-center justify-center text-center py-16 relative">
        <img src="/material-symbols.png" alt="Upload Icon" className="w-16 h-16 mb-4 opacity-90" />
        <h2 className="text-lg font-semibold text-gray-800">No Menus Yet</h2>
        <p className="text-gray-600 text-sm mt-2">
          Upload your PDF or image menus and they'll be instantly available via QR codes.{" "}
          <span className="text-xs text-gray-500">Max size: 10MB</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 relative">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center justify-center gap-2 bg-[#5C2E1B] text-white px-5 py-2.5 rounded-md hover:bg-[#4b2415] transition"
          >
            <span className="text-lg font-bold">+</span> Upload my first menu
          </button>

          <button
            className="bg-white border border-gray-300 text-gray-800 px-5 py-2.5 rounded-md hover:bg-gray-100 transition"
            onClick={toggleTips}
          >
            Tips
          </button>

          {showTips && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 bg-white shadow-lg rounded-md border border-gray-200 p-4 text-start z-30">
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-3">
                <li><b>File size:</b> PDFs under 1MB load fastest.</li>
                <li><b>Formats:</b> PDF, JPG, PNG supported.</li>
                <li><b>Naming:</b> Use clear names like “Breakfast”.</li>
                <li><b>Updating:</b> Replace menu anytime — QR stays linked.</li>
                <li><b>Readability:</b> Use text ≥12pt for mobile.</li>
              </ul>
            </div>
          )}
          {showTips && <div className="fixed inset-0 z-20 sm:hidden" onClick={closeTips}></div>}
        </div>

        {showUploadModal && (
          <UploadMenuModal onClose={() => setShowUploadModal(false)} onSave={handleSaveMenu} isSaving={creating} />
        )}


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
                Upload a PDF or image of your menu. We’ll generate a menu link and QR code automatically.
              </p>
            </div>

            {/* Search */}
            <div className="w-full md:w-64 relative">
              <input
                type="text"
                placeholder="Search menu"
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2E1E]"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
              </svg>
            </div>
          </div>

          {/* Upload Zone */}
          {renderUploadSection()}

          {/* Menus or Empty State */}
          {menuData && menuData.length > 0 ? renderMenuGrid() : renderEmptyState()}

          {/* Modals */}
          {showDeleteModal && (
            <DeleteMenuModal
              menuName={selectedMenuName}
              isDeleting={deleting}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={confirmDeleteMenu}
            />
          )}

          {showEditModal && selectedMenu && (
            <EditMenuModal
              onClose={() => setShowEditModal(false)}
              onSave={handleSaveEdit}
              isSaving={updating}
              initialName={selectedMenu.name}
              initialDescription={selectedMenu.description}
              initialImageUrl={selectedMenu.imageUrl}
            />
          )}
        </div>
      </div>
    );
  }
