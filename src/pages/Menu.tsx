// pages/Menu.tsx
import { useState, useEffect, useRef } from "react";
import SidebarNav from "../components/SidebarNav";
import UploadMenuModal from "../components/UploadMenuModal";
import DeleteMenuModal from "../components/DeleteMenuModal";
import EditMenuModal from "../components/EditMenuModal";
import QrCodeModal from "../components/QrCodeModal";
import MenuCard from "../components/MenuCard";
import SelectDateModal from "../components/SelectDateModal";
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
  const [showSelectDateModal, setShowSelectDateModal] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState<MappedMenu | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [selectedMenuName, setSelectedMenuName] = useState<string>("");
  const [showQrModal, setShowQrModal] = useState<{ name: string; url: string } | null>(null);

  // dateRange holds selection used for display & filtering
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  // when a single clicked date had no menu, this overrides the grid
  const [emptyOverride] = useState<{ date: Date; active: boolean } | null>(null);

  const tipsRef = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const { mutate: createMenu, isLoading: creating } = useCreateMenu();
  const { mutate: deleteMenuMutation, isPending: deleting } = useDeleteMenu();
  const { mutate: updateMenu, isPending: updating } = useUpdateMenu();

  const { data, isLoading, isError, refetch } = useGetMenus({
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  // --- Tips overlay logic ---
  const toggleTips = () => setShowTips((prev) => !prev);
  const closeTips = () => setShowTips(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tipsRef.current && !tipsRef.current.contains(event.target as Node)) {
        setShowTips(false);
      }
    }

    if (showTips) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTips]);

  // Reset page when filters/date change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange.start, dateRange.end]);


  if (isLoading) return <p className="p-6">Loading menus...</p>;
  if (isError) return <p className="p-6 text-red-600">Failed to fetch menus. Please check your token.</p>;

  // --- Menu handlers ---
  const handleSaveMenu = (menuData: {
    menuName: string;
    restaurant: { foodMenu: File | null; drinkMenu: File | null };
    spa: { spaMenu: File | null };
    reviewLink: string;
  }) => {
    const { foodMenu, drinkMenu } = menuData.restaurant;
    const { spaMenu } = menuData.spa;

    if (!foodMenu && !drinkMenu && !spaMenu) {
      toast.error("Please upload at least one menu file (Food, Drink, or Spa).");
      return;
    }

    const MAX_FILE_SIZE_MB = 10;
    const allFiles = [foodMenu, drinkMenu, spaMenu];
    const oversizedFile = allFiles.find((f) => f && f.size / (1024 * 1024) > MAX_FILE_SIZE_MB);
    if (oversizedFile) {
      toast.error(`File ${oversizedFile.name} exceeds ${MAX_FILE_SIZE_MB} MB`);
      return;
    }

    const token = localStorage.getItem("authToken") ?? localStorage.getItem("token");
    if (!token) return toast.error("No auth token found.");

    const formData = new FormData();
    formData.append("name", menuData.menuName);
    if (foodMenu) formData.append("foodMenuFile", foodMenu);
    if (drinkMenu) formData.append("drinkMenuFile", drinkMenu);
    if (spaMenu) formData.append("spaMenuFile", spaMenu);
    if (menuData.reviewLink) formData.append("reviewLink", menuData.reviewLink);

    createMenu(
      { menuData: formData, token },
      {
        onSuccess: (res) => {
          setShowUploadModal(false);
          toast.success("Menu uploaded successfully!");

          // Map the files from the uploaded File objects
          const mappedFiles = [
            foodMenu && { name: foodMenu.name, type: foodMenu.name.endsWith(".pdf") ? "PDF" : "IMG", url: res.data.foodMenuFile?.url, size: foodMenu.size },
            drinkMenu && { name: drinkMenu.name, type: drinkMenu.name.endsWith(".pdf") ? "PDF" : "IMG", url: res.data.drinkMenuFile?.url, size: drinkMenu.size },
            spaMenu && { name: spaMenu.name, type: spaMenu.name.endsWith(".pdf") ? "PDF" : "IMG", url: res.data.spaMenuFile?.url, size: spaMenu.size },
          ].filter(Boolean) as { name: string; type: "PDF" | "IMG"; url: string; size: number }[];

          console.log("Created Files:", mappedFiles);

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

    if (!foodMenu && !drinkMenu && !spaMenu) return toast.error("Please upload at least one menu file (Food, Drink, or Spa).");

    const MAX_FILE_SIZE_MB = 10;
    const allFiles = [foodMenu, drinkMenu, spaMenu];
    const oversizedFile = allFiles.find((f) => f && f.size / (1024 * 1024) > MAX_FILE_SIZE_MB);
    if (oversizedFile) return toast.error(`File "${oversizedFile.name}" exceeds ${MAX_FILE_SIZE_MB} MB`);

    const token = localStorage.getItem("authToken") ?? localStorage.getItem("token");
    if (!token) return toast.error("No auth token found.");
    if (!selectedMenu?.id) return toast.error("Selected menu ID is missing.");

    const formData = new FormData();
    formData.append("name", updatedData.menuName);
    if (foodMenu) formData.append("foodMenuFile", foodMenu);
    if (drinkMenu) formData.append("drinkMenuFile", drinkMenu);
    if (spaMenu) formData.append("spaMenuFile", spaMenu);
    if (updatedData.reviewLink) formData.append("reviewLink", updatedData.reviewLink);

    updateMenu(
      { id: selectedMenu.id, data: formData, token },
      {
        onSuccess: (res) => {
          toast.success("Menu updated successfully!");
          setShowEditModal(false);
          setSelectedMenu(null);

          const mappedFiles = [
            foodMenu && { name: foodMenu.name, type: foodMenu.name.endsWith(".pdf") ? "PDF" : "IMG", url: res.data.foodMenuFile?.url, size: foodMenu.size },
            drinkMenu && { name: drinkMenu.name, type: drinkMenu.name.endsWith(".pdf") ? "PDF" : "IMG", url: res.data.drinkMenuFile?.url, size: drinkMenu.size },
            spaMenu && { name: spaMenu.name, type: spaMenu.name.endsWith(".pdf") ? "PDF" : "IMG", url: res.data.spaMenuFile?.url, size: spaMenu.size },
          ].filter(Boolean) as { name: string; type: "PDF" | "IMG"; url: string; size: number }[];

          console.log("Updated Files:", mappedFiles);
          
          refetch();
        },
        onError: () => toast.error("Failed to update menu."),
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
    deleteMenuMutation({ id: selectedMenuId }, {
      onSuccess: () => { setShowDeleteModal(false); setSelectedMenuId(null); setSelectedMenuName(""); toast.success("Menu deleted successfully!"); refetch(); },
    });
  };

  // Apply date from modal  updates UI
  const handleApplyDate = (range: { start: Date | null; end: Date | null }) => {
    setDateRange(range);
    setShowSelectDateModal(false);
  };

  // --- Render helpers ---
  const renderEmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center text-center py-16 px-4 sm:px-6 lg:px-8 relative">
      <img src="/material-symbols.png" alt="Upload Icon" className="w-20 h-20 mb-6 opacity-90" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Menus Yet</h2>
      <p className="text-gray-600 text-base mb-6 max-w-xl">
        Upload your PDF or image menus and they'll be instantly available via QR codes.
        <span className="text-xs text-gray-500"> Max size: 10MB</span>
      </p>

      <div className="flex flex-col sm:flex-row gap-3 items-center relative">
        <button onClick={() => setShowUploadModal(true)} className="flex items-center justify-center gap-2 bg-[#219ebc] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#00b4d8] transition">
          <span className="text-lg font-bold">+</span> Upload my first menu
        </button>

        <button onClick={toggleTips} className="bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-100 transition">
          Tips
        </button>

        {showTips && (
          <div ref={tipsRef} className="absolute top-full sm:top-0 sm:left-full sm:ml-2 mt-2 sm:mt-0 w-full sm:w-80 bg-white shadow-lg rounded-md border border-gray-200 p-4 text-left z-30">
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li><b>File size:</b> PDFs under 1MB load fastest.</li>
              <li><b>Formats:</b> PDF, JPG, PNG supported.</li>
              <li><b>Naming:</b> Use clear names like “Breakfast”.</li>
              <li><b>Updating:</b> Replace menu anytime — QR stays linked.</li>
              <li><b>Readability:</b> Use text ≥12pt for mobile.</li>
            </ul>
          </div>
        )}

        {showTips && <div className="inset-0 z-20 sm:hidden" onClick={closeTips}></div>}
      </div>
    </div>
  );

  const renderEmptySelectDates = () => (
    <div className="col-span-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
      <img src="/material-symbols.png" alt="Upload Icon" className="w-20 h-20 mb-6 opacity-80" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Menus Found</h2>
      <p className="text-gray-600 text-base mb-6 max-w-xl">
        We couldn’t find any menus for the selected date. Please upload a menu or try selecting a different date.
      </p>
    </div>
  );

  // helper to compare date-only equality
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  // filter menus according to dateRange:
  const filteredMenus: MappedMenu[] = (data?.menus ?? []).filter(menu => {
    if (!dateRange.start) return true; // no filter => show all
    const menuDate = new Date(menu.date);
    if (dateRange.end) {
      // inclusive range compare (date only)
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return menuDate >= start && menuDate <= end;
    } else {
      // single-date match (exact day)
      return sameDay(menuDate, dateRange.start as Date);
    }
  });

  // --- Grid render ---
  const renderMenuGrid = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          My Menus{" "}
          <span className="ml-2 text-xs bg-[#90e0ef] text-[#0096c7] px-2 py-0.5 rounded-md">
            {data?.menus?.length ?? 0}
          </span>
        </h2>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowSelectDateModal(true)} className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>

            {/* Placeholder text on button */}
            {dateRange.start ? (
              `${dateRange.start.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })} — ${dateRange.end
                ? dateRange.end.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
                : dateRange.start.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }`
            ) : (
              "Select Dates"
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {emptyOverride?.active
          ? renderEmptySelectDates()
          : filteredMenus.length > 0
            ? filteredMenus.map(menu => (
              <MenuCard
                key={menu.id}
                name={menu.name}
                files={menu.files ?? []}
                date={menu.date}
                onView={() => console.log("View menu:", menu.name)}
                onEdit={() => handleEditMenu(menu)}
                onQR={() => setShowQrModal({ name: menu.name, url: menu.qrUrl || menu.url || "#" })}
                onDelete={() => handleDeleteMenu(menu.id || "", menu.name)}
              />
            ))
            : renderEmptyState()
        }
      </div>
    </div>
  );

  // --- Upload Section ---
  const renderUploadSection = () => (
    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition mb-10 group">
      <div className="flex items-center text-[#219ebc] justify-center h-full w-full mb-3">
        <img src="/upload-cloud.png" alt="Upload Cloud" />
      </div>
      <p className="text-gray-500">
        <span className="text-[#219ebc] cursor-pointer hover:underline" onClick={() => setShowUploadModal(true)}>
          Click to Upload
        </span>{" "}
        or drag and drop a new menu
      </p>

      <button
        onClick={() => setShowUploadModal(true)}
        aria-label="Upload new menu"
        className="hidden md:group-hover:flex absolute bottom-4 right-4 items-center justify-center bg-white/60 backdrop-blur-sm shadow-xl rounded-lg p-3 hover:bg-white/70 transition"
      >
        <img src="/file-icon.png" alt="Upload" className="w-6 h-6 filter saturate-150" />
      </button>

      {showUploadModal && <UploadMenuModal onClose={() => setShowUploadModal(false)} onSave={handleSaveMenu} isSaving={creating} />}
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
            initialName={selectedMenu.name}
          />
        )}

        {showQrModal && (
          <QrCodeModal
            onClose={() => setShowQrModal(null)}
            menuName={showQrModal.name}
            qrUrl={showQrModal.url}
          />
        )}

        {showSelectDateModal && (
          <SelectDateModal
            onClose={() => setShowSelectDateModal(false)}
            onApply={handleApplyDate}
            onDateSelect={handleApplyDate}
            initialRange={dateRange}
            monthsShown={2}
          />
        )}
      </div>
    </div>
  );
}
