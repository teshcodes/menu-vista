import type { ReactNode } from "react";
import SidebarNav from "../components/SidebarNav";
import { TrendingUp, Eye, UtensilsCrossed, Zap } from "lucide-react"; 

// --- Card Component for better readability (Inline for this file) ---
const KpiCard = ({ title, value, change, icon, iconColor }: { title: string, value: string, change: string, icon: ReactNode, iconColor: string }) => (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className={`p-2 rounded-full ${iconColor.replace('text-', 'bg-').replace('-600', '-100')} ${iconColor}`}>
                {icon}
            </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
        <p className={`mt-2 text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} vs last month
        </p>
    </div>
);


export default function AnalyticsPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <SidebarNav />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-7 overflow-y-auto bg-gray-50 ">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics
          </h1>
          <p className="text-gray-600 mb-6">
            Monitor your menu performance, customer engagement, and traffic trends.
          </p>

          {/* --- 1. Key Performance Indicators (KPIs) Grid --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Views KPI */}
            <KpiCard
              title="Total Menu Views"
              value="15,450"
              change="+12.5%"
              icon={<Eye size={20} />}
              iconColor="text-blue-600"
            />
            {/* Engagement Rate KPI */}
            <KpiCard
              title="Avg. Engagement Rate"
              value="65%"
              change="+4.2%"
              icon={<TrendingUp size={20} />}
              iconColor="text-green-600"
            />
            {/* Total Items KPI */}
            <KpiCard
              title="Total Menu Items"
              value="55"
              change="+0"
              icon={<UtensilsCrossed size={20} />}
              iconColor="text-purple-600"
            />
            {/* Average Session Duration KPI */}
            <KpiCard
              title="Avg. Session Time"
              value="1:45 min"
              change="-0.5%"
              icon={<Zap size={20} />}
              iconColor="text-orange-600"
            />
          </div>

          {/* --- 2. Charts and Detailed Tables --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Traffic & Performance Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Menu Views & Clicks Over Time
              </h2>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg text-gray-500 border border-dashed">
                Area Chart Placeholder (e.g., Views vs. Engagement)
              </div>
            </div>

            {/* Quick Summary/Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Top Insights
                </h2>
                <div className="space-y-4">
                    <div className="p-3 bg-indigo-50 rounded-lg">
                        <p className="text-sm font-medium text-indigo-700">Best Performer:</p>
                        <p className="text-sm text-gray-700">**The Signature Steak** (890 Views)</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-medium text-yellow-700">Lowest Performer:</p>
                        <p className="text-sm text-gray-700">**Truffle Fries** (15 Views)</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-700">High Bounce Rate:</p>
                        <p className="text-sm text-gray-700">**Dessert Page** (80% Exit Rate)</p>
                    </div>
                </div>
                <button 
                    className="mt-6 text-[#5C2E1E] font-medium text-sm hover:underline"
                    onClick={() => console.log('Link to detailed segmentation settings')}
                >
                    View Segmentation Settings
                </button>
            </div>
          </div>
          
          {/* --- 3. Menu Item Rankings Table --- */}
          <div className="bg-white rounded-xl shadow-lg p-6 border mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Top 5 Menu Item Performance
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement %</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Signature Steak</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">890</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">75%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Mains</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Spicy Veggie Burger</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">720</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">68%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Specials</td>
                        </tr>
                        {/* More rows would go here */}
                    </tbody>
                </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}