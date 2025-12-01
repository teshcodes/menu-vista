import { useState } from "react";
import { FileText, Image as ImageIcon, Trash2, Edit } from "lucide-react";
import UploadMenuModal from "../components/UploadMenuModal";
import DeleteMenuModal from "./DeleteMenuModal";
import EditMenuModal from "./EditMenuModal";
import QrCodeModal from "./QrCodeModal";
import { useUpdateMenu } from "../hooks/useUpdateMenu";
import { toast } from "sonner";

interface Menu {
  id: string;
  name: string;
  type: "PDF" | "IMG";
  date: string;
  size: string;
  location?: string;
  description?: string;
}

interface NewMenu {
  name?: string;
  type?: "PDF" | "IMG";
}

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState<{ name: string; url: string } | null>(null);

  const hasMenus = menus.length > 0;
  const { mutateAsync: updateMenu, isPending: updating } = useUpdateMenu();

  /* -------------------- MENU ACTIONS -------------------- */

  const handleAddMenu = (newMenu: NewMenu) => {
    const dummyMenu: Menu = {
      id: Date.now().toString(),
      name: newMenu.name || `New Menu ${menus.length + 1}`,
      type: newMenu.type || "IMG",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      size: "0.7MB", // dummy size since we are not handling files
    };

    setMenus((prev) => [dummyMenu, ...prev]);
    setShowUploadModal(false);
  };

  const handleDeleteMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setShowDeleteModal(true);
  };

  const confirmDeleteMenu = () => {
    if (!selectedMenu) return;
    setMenus((prev) => prev.filter((menu) => menu.id !== selectedMenu.id));
    closeAllModals();
  };

  const handleEditMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setShowEditModal(true);
  };

  const handleViewMenu = (menu: Menu) => {
    console.log("Viewing menu:", menu.name);
  };

  const handleQRCode = (menu: Menu) => {
    setShowQrModal({ name: menu.name, url: `/qr/${menu.id}` });
  };

  /* -------------------- UPDATE MENU -------------------- */

  const handleSaveEdit = async (menuData: {
    menuName: string;
    location?: string;
    description?: string;
  }) => {
    if (!selectedMenu) return;

    try {
      // optional backend call
      await updateMenu({ id: selectedMenu.id, data: menuData });

      const updatedMenu: Menu = {
        ...selectedMenu,
        name: menuData.menuName,
        location: menuData.location,
        description: menuData.description,
      };

      setMenus((prev) =>
        prev.map((m) => (m.id === selectedMenu.id ? updatedMenu : m))
      );

      closeAllModals();
      toast.success("Menu updated successfully!");
    } catch (error) {
      console.error("Failed to update menu:", error);
      toast.error("Failed to update menu.");
    }
  };

  /* -------------------- HELPERS -------------------- */
  const closeAllModals = () => {
    setShowUploadModal(false);
    setShowDeleteModal(false);
    setShowEditModal(false);
    setSelectedMenu(null);
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {!hasMenus ? (
        <div className="text-center py-16">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Menus</h1>
          <p className="text-gray-600 mb-6">
            Upload a PDF or image of your menu. We’ll generate a menu link and QR code automatically.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-[#5C2E1E] text-white px-5 py-2.5 rounded-md hover:bg-[#4b2415] transition"
          >
            + Upload my first menu
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Menus</h1>
              <p className="text-sm text-gray-500">
                Upload a PDF or image of your menu. We’ll generate a link and QR code automatically.
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-[#5C2E1E] text-white px-4 py-2 rounded-md hover:bg-[#4A2417] transition"
            >
              + Upload New Menu
            </button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menus.map((menu) => (
              <div
                key={menu.id}
                className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {menu.type === "PDF" ? (
                      <FileText size={18} className="text-[#5C2E1E]" />
                    ) : menu.type === "IMG" ? (
                      <ImageIcon size={18} className="text-[#5C2E1E]" />
                    ) : (
                      <div className="text-xs font-semibold px-2 py-0.5 rounded bg-yellow-200 text-yellow-800">MIXED</div>
                    )}
                    <h2 className="text-sm font-medium text-gray-800">
                      {menu.name}
                    </h2>
                  </div>

                  <button
                    onClick={() => handleDeleteMenu(menu)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {menu.type} • {menu.date} • {menu.size}
                </p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleViewMenu(menu)}
                    className="text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditMenu(menu)}
                    className="flex items-center gap-1 text-sm border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50 transition"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleQRCode(menu)}
                    className="text-sm bg-[#5C2E1E] text-white rounded-md px-3 py-1 hover:bg-[#4A2417] transition"
                  >
                    QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* -------------------- MODALS -------------------- */}
      {showUploadModal && (
        <UploadMenuModal
          onClose={() => setShowUploadModal(false)}
          onSave={(data) =>
            handleAddMenu({
              name: data.menuName,
              type: "IMG",
            })
          }
        />
      )}

      {showDeleteModal && selectedMenu && (
        <DeleteMenuModal
          menuName={selectedMenu.name}
          onClose={closeAllModals}
          onConfirm={confirmDeleteMenu}
        />
      )}

      {showEditModal && selectedMenu && (
        <EditMenuModal
          onClose={closeAllModals}
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
    </div>
  );
}
