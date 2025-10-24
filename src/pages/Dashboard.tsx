// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { auth, signOut, onAuthStateChanged } from "../lib/firebase";
import type { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import SidebarNav from "../components/SidebarNav"

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (!currentUser) {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("appUser");
            navigate("/login");
        } catch (err) {
            console.error("Error logging out:", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">
                    <svg
                        className="animate-spin h-8 w-8 mr-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <SidebarNav />
            <div className="min-h-screen p-7">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold">Dashboard</h1>
                            <p className="text-gray-600">Welcome back, {user.displayName || user.email}!</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-[#5C2E1E] text-white px-4 py-2 rounded hover:bg-[#4a2f19] transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        {/* Dashboard content can go here */}
                        <p className="text-gray-600">Your account: {user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
