 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Utensils, BarChart3, Clock, TrendingUp } from "lucide-react"; 
import SidebarNav from "../components/SidebarNav";
import { getBusinessProfile, logout } from "../services/clearEssenceAPI";  
import { toast } from "sonner";  

interface BusinessProfile {
    name?: string;
    email?: string;
    businessName?: string; 
    type?: string; 
}

// --- Card Component for better readability (Inline for this file) ---
const StatCard = ({ title, value, icon, bgColor }: { title: string, value: string, icon: React.ReactNode
, bgColor: string }) => (
    <div className={`flex items-center justify-between p-5 rounded-xl shadow-md ${bgColor}`}>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full bg-opacity-30 ${bgColor.replace('bg-', 'bg-')}`}>
            {icon}
        </div>
    </div>
);

// --- Dashboard Component ---
export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<BusinessProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.log("No auth token found. Redirecting to login.");
            navigate("/login", { replace: true });
            return;
        }

        const fetchProfile = async (currentToken: string) => {
            try {
                const data = await getBusinessProfile(currentToken);
                setUser(data); 

            } catch (err: unknown) {
                console.error("Dashboard: Failed to fetch profile. Removing token and redirecting.", err);
                toast.error("Session expired or invalid. Please log in again.");
                localStorage.removeItem("authToken");
                navigate("/login", { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile(token);
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem("authToken");
        
        if (token) {
            try {
                await logout(token);
            } catch (err) {
                console.warn("Backend logout process failed:", err);
            }
        }
        
        // Frontend cleanup and redirect
        localStorage.removeItem("authToken");
        localStorage.removeItem("appUser");  
        toast.info("You have been logged out.");
        navigate("/login", { replace: true });
    };
    
    // Derived Display Name (using the same logic from SidebarNav)
    const displayName = user?.businessName || user?.name || user?.email?.split('@')[0] || "User";


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <p className="text-lg text-gray-600">Loading Dashboard...</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Sidebar */}
            <SidebarNav />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-7">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header and Logout */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600 mt-1">
                                {`Welcome back, ${displayName}! Here's your business overview.`}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="hidden sm:inline-flex items-center bg-[#5C2E1E] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#4a2f19] transition-colors duration-200"
                        >
                            <span className="mr-2">Logout</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* --- 1. Key Performance Indicators (KPIs) Grid --- */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Placeholder data for illustration */}
                        <StatCard 
                            title="Total Menus" 
                            value="12" 
                            icon={<Utensils size={24} className="text-green-600" />} 
                            bgColor="bg-white" 
                        />
                        <StatCard 
                            title="New Signups" 
                            value="52" 
                            icon={<TrendingUp size={24} className="text-blue-600" />} 
                            bgColor="bg-white" 
                        />
                        <StatCard 
                            title="Total Views" 
                            value="3,450" 
                            icon={<BarChart3 size={24} className="text-purple-600" />} 
                            bgColor="bg-white" 
                        />
                         <StatCard 
                            title="Last Update" 
                            value="1h ago" 
                            icon={<Clock size={24} className="text-orange-600" />} 
                            bgColor="bg-white" 
                        />
                    </div>
                    
                    {/* --- 2. Quick Actions & Profile Status --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        
                        {/* Quick Actions Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => navigate("/menu?action=create")}
                                    className="flex flex-col items-start p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                                >
                                    <Utensils size={20} className="mb-2" />
                                    <span className="font-semibold">Create New Menu</span>
                                    <span className="text-xs text-gray-500 mt-1">Add a dish or category</span>
                                </button>
                                <button
                                    onClick={() => navigate("/analytics")}
                                    className="flex flex-col items-start p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                                >
                                    <BarChart3 size={20} className="mb-2" />
                                    <span className="font-semibold">View Analytics</span>
                                    <span className="text-xs text-gray-500 mt-1">Check menu performance</span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Business Profile Status Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#5C2E1E]">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Summary</h2>
                            <p className="text-gray-700 text-sm mb-2">
                                **Business Type:** {user?.type ?? "N/A (Update Profile)"}
                            </p>
                            <p className="text-gray-700 text-sm mb-2">
                                **Account Name:** {user?.name ?? "N/A"}
                            </p>
                            <p className="text-gray-700 text-sm mb-2">
                                **Account Email:** {user?.email ?? "—"}
                            </p>
                            <button
                                onClick={() => navigate("/settings")}
                                className="mt-4 text-[#5C2E1E] font-medium text-sm hover:underline flex items-center"
                            >
                                Complete Profile Setup <ArrowRight size={14} className="ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* --- 3. Recent Activity/Charts Area --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Menu Performance Overview (Chart Placeholder)</h2>
                            <div className="h-64 bg-gray-100 flex items-center justify-center rounded-lg text-gray-500">
                                Bar Chart showing views over last 30 days
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Menu Changes</h2>
                            <ul className="space-y-3 text-sm text-gray-700">
                                <li>**10 min ago:** Added 'Spicy Veggie Burger'</li>
                                <li>**2 hrs ago:** Updated 'Desserts' category description</li>
                                <li>**Yesterday:** Removed 'Seasonal Salad'</li>
                            </ul>
                            <button className="mt-4 text-[#5C2E1E] font-medium text-sm hover:underline">
                                View all activity
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}