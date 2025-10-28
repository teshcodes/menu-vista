import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  BarChart3,
  MoreVertical,
  Settings,
  LifeBuoy,
  LogOut,
  User as UserIcon,
  Menu,
  X,
} from "lucide-react";
import { auth, signOut } from "../lib/firebase";

interface UserData {
  displayName?: string;
  email?: string;
}

export default function SidebarNav() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("appUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const truncateEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    return localPart.length > 10
      ? `${localPart.slice(0, 10)}...@${domain}`
      : email;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("appUser");
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { label: "Menu", icon: <UtensilsCrossed size={20} />, path: "/menu" },
    { label: "Analytics", icon: <BarChart3 size={20} />, path: "/analytics" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
  <>
    {/* ✅ Mobile Top Bar (Logo + Menu Icon, Sticky) */}
    <div className="md:hidden flex items-center justify-between px-4 py-3 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
      </div>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="text-gray-700 focus:outline-none"
      >
        {sidebarOpen ? <X size={26} /> : <Menu size={26} />}
      </button>
    </div>

    {/* ✅ Sidebar Drawer for Mobile & Static for Desktop */}
    <aside
      className={`bg-[#F9FAFB] shadow-md fixed md:static top-0 left-0 h-full w-64 flex flex-col justify-between px-3 transition-transform duration-300 z-50
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}
    >
      {/* --- User Info --- */}
      <div>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#5C2E1E]/10 p-2 rounded-full">
              <UserIcon className="text-[#5C2E1E]" size={22} />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm truncate max-w-[120px]">
                {user?.displayName || "Guest User"}
              </p>
              <p className="text-xs text-gray-500" title={user?.email}>
                {user?.email ? truncateEmail(user.email) : "No email"}
              </p>
            </div>
          </div>
        </div>

        {/* --- Navigation --- */}
        <nav className="mt-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 rounded-lg hover:bg-[#5C2E1E] hover:text-white transition-colors"
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* --- Footer / Account Dropdown --- */}
      <div className="border-t p-4 flex items-center justify-between relative" ref={dropdownRef}>
        <div className="flex items-center gap-3">
          <div className="bg-[#5C2E1E]/10 p-2 rounded-full">
            <UserIcon className="text-[#5C2E1E]" size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm truncate max-w-[100px]">
              {user?.displayName || "Guest User"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.email ? truncateEmail(user.email) : "No email"}
            </p>
          </div>
        </div>

        {/* --- Dropdown Menu --- */}
        <div className="relative">
          <MoreVertical
            className="text-gray-500 cursor-pointer hover:text-[#5C2E1E]"
            size={18}
            onClick={() => setShowMenu(!showMenu)}
          />

          {showMenu && (
            <div className="absolute bottom-11 -right-4 md:bottom-14 md:left-0 bg-white shadow-lg rounded-lg py-2 w-56 z-50 border">
              <div className="flex items-center gap-3 px-4 py-2 border-b">
                <div className="bg-[#5C2E1E]/10 p-2 rounded-full">
                  <UserIcon className="text-[#5C2E1E]" size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 truncate max-w-[110px]">
                    {user?.displayName || "Guest User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[110px]">
                    {user?.email ? truncateEmail(user.email) : "No email"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/settings")}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
              >
                <Settings size={16} /> Settings
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2">
                <LifeBuoy size={16} /> Support
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>

    {/* ✅ Overlay when Sidebar is Open (Mobile only) */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-30 md:hidden"
        onClick={() => setSidebarOpen(false)}
      ></div>
    )}
  </>
);

}
