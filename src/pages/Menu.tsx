import { useState } from "react";
import { FaBars } from "react-icons/fa";
import SidebarNav from "../components/SidebarNav";

export default function MenuPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen relative">

      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-[#5C2E1E] focus:outline-none"
        >
          <FaBars size={22} />
        </button>
      </div>

      {/* Sidebar - visible on md+ OR toggled on mobile */}
      <div
        className={`${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transform transition-transform duration-300 ease-in-out fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg z-40`}
      >
        <SidebarNav />
      </div>

      {/* Overlay for mobile when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 mt-16 md:mt-0">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
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
          {/* Decorative Lines as Background */}
          <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 -mt-40">
            <div className="bg-[#F2F4F7] w-20 h-3 rounded-xl"></div>
            <div className="bg-[#F2F4F7] w-36 h-3 rounded-xl"></div>
            <div className="bg-[#F2F4F7] ml-8 w-28 h-3 rounded-xl"></div>
            <div className="bg-[#F2F4F7] w-36 mr-10 h-3 rounded-r-s rounded-xl"></div>
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
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button className="flex items-center justify-center gap-2 bg-[#5C2E1B] text-white px-5 py-2.5 rounded-md hover:bg-[#4b2415] transition">
              <span className="text-lg font-bold">+</span> Upload my first menu
            </button>

            <button className="bg-white border border-gray-300 text-gray-800 px-5 py-2.5 rounded-md hover:bg-gray-100 transition">
              Tips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
