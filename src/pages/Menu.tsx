import { useState, useEffect } from "react";
import SidebarNav from "../components/SidebarNav";
import UploadMenuModal from "../components/UploadMenuModal";
import DeleteMenuModal from "../components/DeleteMenuModal";
import EditMenuModal from "../components/EditMenuModal";
import QrCodeModal from "../components/QrCodeModal";
import MenuCard from "../components/MenuCard";
import { useCreateMenu } from "../hooks/useCreateMenu";
import { useDeleteMenu } from "../hooks/useDeleteMenu";
import { useUpdateMenu } from "../hooks/useUpdateMenu";
import { useGetMenus } from "../hooks/useGetMenus";
import type { MappedMenu } from "../hooks/useGetMenus";
import { toast } from "sonner";

export default function Menu() {
  // --- State ---
  const [showTips, setShowTips] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedMenu, setSelectedMenu] = useState<MappedMenu | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [selectedMenuName, setSelectedMenuName] = useState<string>("");
  const [showQrModal, setShowQrModal] = useState<{ name: string; url: string } | null>(null);


  // --- Tips ---
  const toggleTips = () => setShowTips((prev) => !prev);
  const closeTips = () => setShowTips(false);

  const ITEMS_PER_PAGE = 8;

  // --- Hooks ---
  const { mutate: createMenu, isLoading: creating } = useCreateMenu();
  const { mutate: deleteMenuMutation, isPending: deleting } = useDeleteMenu();
  const { mutate: updateMenu, isPending: updating } = useUpdateMenu();

  const { data, isLoading, isError, refetch } = useGetMenus({
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    search: searchTerm,
    type: filterType === "All" ? "" : filterType,
    category: filterCategory === "All" ? "" : filterCategory,
  });

  useEffect(() => {
    setCurrentPage(1); // reset to first page when filters/search change
  }, [filterType, filterCategory, searchTerm]);

  if (isLoading) return <p className="p-6">Loading menus...</p>;
  if (isError) return <p className="p-6 text-red-600">Failed to fetch menus. Please check your token.</p>;

  // --- Handlers ---
  const handleSaveMenu = (menuData: {
  menuName: string;
  restaurant: { foodMenu: File | null; drinkMenu: File | null };
  spa: { spaMenu: File | null };
  reviewLink: string; // optional, if backend doesn’t need it you can omit
}) => {
  const { foodMenu, drinkMenu } = menuData.restaurant;
  const { spaMenu } = menuData.spa;

  // Ensure at least one file is uploaded
  if (!foodMenu && !drinkMenu && !spaMenu) {
    toast.error("Please upload at least one menu file (Food, Drink, or Spa).");
    return;
  }

  // Max file size validation
  const MAX_FILE_SIZE_MB = 10;
  const allFiles = [foodMenu, drinkMenu, spaMenu];
  const oversizedFile = allFiles.find(
    (f) => f && f.size / (1024 * 1024) > MAX_FILE_SIZE_MB
  );
  if (oversizedFile) {
    toast.error(`File ${oversizedFile.name} exceeds ${MAX_FILE_SIZE_MB} MB`);
    return;
  }

  const token =
    localStorage.getItem("authToken") ??
    localStorage.getItem("token");
  if (!token) {
    toast.error("No auth token found.");
    return;
  }

  // Build FormData exactly as backend expects
  const formData = new FormData();
  formData.append("name", menuData.menuName);

  if (foodMenu) formData.append("foodMenuFile", foodMenu);
  if (drinkMenu) formData.append("drinkMenuFile", drinkMenu);
  if (spaMenu) formData.append("spaMenuFile", spaMenu);

  createMenu(
    { menuData: formData, token },
    {
      onSuccess: () => {
        setShowUploadModal(false);
        toast.success("Menu uploaded successfully!");
        refetch();
      },
      onError: () => toast.error("Failed to upload menu."),
    }
  );
};


  const handleEditMenu = (menu: MappedMenu) => {
    setSelectedMenu(menu);
    setShowEditModal(true);
  };

const handleSaveEdit = (updatedData: {
  menuName: string;
  restaurant: { foodMenu: File | null; drinkMenu: File | null };
  spa: { spaMenu: File | null };
  reviewLink?: string;
}) => {
  const { foodMenu, drinkMenu } = updatedData.restaurant;
  const { spaMenu } = updatedData.spa;

  // 1️⃣ Ensure at least one file is uploaded
  if (!foodMenu && !drinkMenu && !spaMenu) {
    toast.error("Please upload at least one menu file (Food, Drink, or Spa).");
    return;
  }

  // 2️⃣ Max file size validation
  const MAX_FILE_SIZE_MB = 10;
  const allFiles = [foodMenu, drinkMenu, spaMenu];
  const oversizedFile = allFiles.find(f => f && f.size / (1024 * 1024) > MAX_FILE_SIZE_MB);

  if (oversizedFile) {
    toast.error(`File "${oversizedFile.name}" exceeds ${MAX_FILE_SIZE_MB} MB`);
    return;
  }

  // 3️⃣ Retrieve auth token
  const token = localStorage.getItem("authToken") ?? localStorage.getItem("token");
  if (!token) {
    toast.error("No auth token found.");
    return;
  }

  // 4️⃣ Build FormData exactly as backend expects
  const formData = new FormData();
  formData.append("name", updatedData.menuName);
  if (foodMenu) formData.append("foodMenuFile", foodMenu);
  if (drinkMenu) formData.append("drinkMenuFile", drinkMenu);
  if (spaMenu) formData.append("spaMenuFile", spaMenu);
  if (updatedData.reviewLink) formData.append("reviewLink", updatedData.reviewLink);

  // 5️⃣ Call API
  if (!selectedMenu?.id) {
    toast.error("Selected menu ID is missing.");
    return;
  }

  updateMenu(
    { id: selectedMenu.id, data: formData, token },
    {
      onSuccess: () => {
        toast.success("Menu updated successfully!");
        setShowEditModal(false);
        setSelectedMenu(null);
        refetch(); // refresh list or data
      },
      onError: () =>
        toast.error("Failed to update menu. Please check your token or try again."),
    }
  );
};


  const handleDeleteMenu = (menuId: string, menuName: string) => {
    setSelectedMenuId(menuId);
    setSelectedMenuName(menuName);
    setShowDeleteModal(true);
  };

  const confirmDeleteMenu = () => {
    if (!selectedMenuId) return;

    deleteMenuMutation(
      { id: selectedMenuId },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedMenuId(null);
          setSelectedMenuName("");
          toast.success("Menu deleted successfully!");
          refetch();
        },
      }
    );
  };

  // --- Render Functions ---
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center py-16 relative">
      <img src="/material-symbols.png" alt="Upload Icon" className="w-16 h-16 mb-4 opacity-90" />
      <h2 className="text-lg font-semibold text-gray-800">No Menus Yet</h2>
      <p className="text-gray-600 text-sm mt-2">
        Upload your PDF or image menus and they'll be instantly available via QR codes.
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
    </div>
  );

  const renderMenuGrid = () => {
    const menus = data?.menus || [];

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            My Menus{" "}
            <span className="ml-2 text-xs bg-[#EAD7C4] text-[#5C2E1E] px-2 py-0.5 rounded-md">
              {data?.total ?? 0}
            </span>
          </h2>


          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-1/2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm bg-white w-full sm:w-auto"
            >
              <option value="All">All Types</option>
              <option value="PDF">PDF</option>
              <option value="IMG">Image</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm bg-white w-full sm:w-auto"
            >
              <option value="All">All Categories</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>

            <input
              type="text"
              placeholder="Search menu"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md pl-3 pr-4 py-2 text-sm w-full sm:w-auto flex-1 focus:outline-none focus:ring-2 focus:ring-[#5C2E1E]"
            />
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {menus.length > 0 ? (
            menus.map((menu) => (
              <MenuCard
                key={menu.id}
                name={menu.name}
                fileType={menu.type}
                date={menu.date}
                fileSize={`${Math.min(menu.fileSize / (1024 * 1024), 10).toFixed(2)} MB`}
                onView={() => console.log("View menu:", menu.name)}
                onEdit={() => handleEditMenu(menu)}
                onQR={() => setShowQrModal({ name: menu.name, url: menu.url ?? "#" })}
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

  // --- Upload Section ---
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

      {/* Upload Icon Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        aria-label="Upload new menu"
        className="hidden md:group-hover:flex absolute bottom-4 right-4 items-center justify-center bg-white/60 backdrop-blur-sm shadow-xl rounded-lg p-3 hover:bg-white/70 transition" >
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

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SidebarNav />
      <div className="flex-1 overflow-y-auto p-6 md:mt-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 mt-4 md:mt-0">
          <div>
            <h1 className="text-3xl font-semibold text-black mb-2 md:mb-0">Menus</h1>
            <p className="text-gray-600 text-sm mt-1">
              Upload a PDF or image of your menu. We’ll generate a menu link and QR code automatically.
            </p>
          </div>
        </div>

        {renderUploadSection()}
        {renderMenuGrid()}

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
             
          />
        )}

        {showQrModal && (
          <QrCodeModal
            onClose={() => setShowQrModal(null)}
            menuName={showQrModal.name}
            qrUrl={showQrModal.url}
          />
        )}
      </div>
    </div>
  );
}
