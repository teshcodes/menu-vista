import SidebarNav from "../components/SidebarNav";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <SidebarNav />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Analytics
          </h1>
          <p className="text-gray-600 mb-8">
            Monitor your restaurant’s performance, customer engagement, and sales insights here.
          </p>

          {/* Placeholder Box */}
          <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-xl h-64 bg-white shadow-sm">
            <p className="text-gray-400">Analytics dashboard coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
