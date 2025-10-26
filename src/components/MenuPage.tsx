import { useState } from "react";
import { FileText, Image as ImageIcon, Trash2, Edit } from "lucide-react";
import UploadMenuModal from "../components/UploadMenuModal";

interface Menu {
  id: number;
  name: string;
  type: "PDF" | "IMG";
  date: string;
  size: string;
}

interface NewMenu {
  name?: string;
  type?: "PDF" | "IMG";
  file?: File;
}

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const hasMenus = menus.length > 0;

  const handleAddMenu = (newMenu: NewMenu) => {
    const dummyMenu: Menu = {
      id: Date.now(),
      name: newMenu?.name || `New Menu ${menus.length + 1}`,
      type: newMenu?.type || "IMG",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      size: newMenu?.file ? `${(newMenu.file.size / (1024 * 1024)).toFixed(1)}MB` : "0.7MB",
    };
    setMenus([dummyMenu, ...menus]);
    setShowUploadModal(false);
  };

  const handleDeleteMenu = (id: number) => {
    setMenus(menus.filter(menu => menu.id !== id));
  };

  const handleViewMenu = (menu: Menu) => {
    // Implement view functionality
    console.log('Viewing menu:', menu.name);
  };

  const handleEditMenu = (menu: Menu) => {
    // Implement edit functionality
    console.log('Editing menu:', menu.name);
  };

  const handleQRCode = (menu: Menu) => {
    // Implement QR code generation
    console.log('Generating QR code for:', menu.name);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {!hasMenus ? (
        <>
          {/* Blank Upload Page */}
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
        </>
      ) : (
        <>
          {/* Header */}
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

          {/* Grid of Menus */}
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
                    ) : (
                      <ImageIcon size={18} className="text-[#5C2E1E]" />
                    )}
                    <h2 className="text-sm font-medium text-gray-800">{menu.name}</h2>
                  </div>

                  <button 
                    onClick={() => handleDeleteMenu(menu.id)}
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

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadMenuModal
          onClose={() => setShowUploadModal(false)}
          onSave={(data) => handleAddMenu({
            name: data.name,
            file: data.file || undefined,
            type: data.file?.type.includes('pdf') ? 'PDF' : 'IMG'
          })}
        />
      )}
    </div>
  );
}
