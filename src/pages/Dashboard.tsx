import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarNav from "../components/SidebarNav";
import { clearEssenceAPI } from "../services/clearEssenceAPI";

interface BusinessProfile {
    name?: string;
    email?: string;
    displayName?: string;
    
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<BusinessProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        const fetchProfile = async () => {
            try {
                const data = await clearEssenceAPI.getBusinessProfile(token);
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                // If token expired/invalid, remove and redirect to login
                localStorage.removeItem("authToken");
                navigate("/login", { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem("authToken");
        try {
            if (token) {
                try {
                    await clearEssenceAPI.logout(token);
                } catch (err) {
                    // ignore errors from logout call
                    console.warn("Backend logout failed or not supported:", err);
                }
            }

            // Clear client-side auth and redirect
            localStorage.removeItem("authToken");
            navigate("/login", { replace: true });
        } catch (err) {
            console.error("Error logging out:", err);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar - fixed/sticky */}
            <div className="sticky top-0 h-screen w-64 shrink-0">
                <SidebarNav />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-7">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold">Dashboard</h1>
                            <p className="text-gray-600">
                                {loading ? "Loading profile..." : `Welcome back, ${user?.displayName ?? user?.name ?? user?.email ?? "User"}`}!
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-[#5C2E1E] text-white px-4 py-2 rounded hover:bg-[#4a2f19] transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <p className="text-gray-600">Your account: {user?.email ?? "—"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
