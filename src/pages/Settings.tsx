import { useState } from "react";
import { Mail, Phone, Upload, Clock, Building2 } from "lucide-react";
import SidebarNav from "../components/SidebarNav";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");

    // Tabs configuration
    const tabs = ["Profile", "Password", "Team", "Plan", "Billing", "Customize"];
    const disabledTabs = ["Team", "Plan", "Billing", "Customize"];

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="md:w-64 md:h-screen md:sticky md:top-0 md:self-start">
                <SidebarNav />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex justify-center items-start md:items-center">
                    <div className="w-full max-w-3xl bg-white shadow-sm rounded-xl border border-gray-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-4 border-b border-gray-100 px-4 sm:px-6 pt-4">
                            {tabs.map((tab) => {
                                const isDisabled = disabledTabs.includes(tab);
                                const isActive = activeTab === tab.toLowerCase();

                                return (
                                    <button
                                        key={tab}
                                        onClick={() => !isDisabled && setActiveTab(tab.toLowerCase())}
                                        disabled={isDisabled}
                                        className={`pb-2 text-sm font-medium rounded-lg transition ${isActive
                                                ? "text-[#5C2E1E] bg-gray-200 border-2 p-2 border-[#5C2E1E]"
                                                : isDisabled
                                                    ? "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70 px-3 py-2"
                                                    : "text-gray-600 hover:text-[#5C2E1E] px-3 py-2"
                                            }`}
                                        title={isDisabled ? "Coming soon" : ""}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>

                        {/* PROFILE TAB */}
                        {activeTab === "profile" && (
                            <div className="p-4 sm:p-6 space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
                                    <p className="text-sm text-gray-500">
                                        Update details shown to guests and on your short link preview.
                                    </p>
                                </div>

                                <form className="space-y-5">
                                    {/* Business Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Crestabel Inc"
                                            className="mt-1 w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                                        />
                                    </div>

                                    {/* Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Restaurant"
                                            className="mt-1 w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                                        />
                                    </div>

                                    {/* Phone + Email */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <div className="flex items-center border border-gray-300 rounded-md p-2.5">
                                                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                                <input
                                                    type="text"
                                                    placeholder="+234 700 000 0000"
                                                    className="w-full focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="flex items-center border border-gray-300 rounded-md p-2.5">
                                                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                                <input
                                                    type="email"
                                                    placeholder="support@crestsomething.com"
                                                    className="w-full focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Logo Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Logo
                                        </label>
                                        <p className="text-sm text-gray-500 mb-2">
                                            This will be displayed on your profile.
                                        </p>
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Building2 className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:bg-gray-50 transition">
                                                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                                <span className="text-sm text-gray-600">
                                                    Click to upload or drag and drop
                                                </span>
                                                <p className="text-xs text-gray-400">
                                                    SVG, PNG, JPG, or GIF (max. 800×400px)
                                                </p>
                                                <input type="file" className="hidden" />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1">
                                            <input
                                                type="text"
                                                placeholder="Abuja"
                                                className="flex-1 border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                                            />
                                            <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                <input type="checkbox" className="rounded text-[#5C2E1E]" />
                                                I have a physical address
                                            </label>
                                        </div>
                                    </div>

                                    {/* Opening Hours */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Opening Hours
                                        </label>
                                        <div className="flex items-center border border-gray-300 rounded-md p-2.5">
                                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                            <input
                                                type="text"
                                                placeholder="(WAT) UTC+08:00 - 5:00 PM"
                                                className="w-full focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Short Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Short Description
                                        </label>
                                        <p className="text-sm text-gray-500 mb-2">
                                            Briefly describe your business
                                        </p>
                                        <textarea
                                            placeholder="Elegant, touch-free fine dining for guests."
                                            rows={3}
                                            maxLength={275}
                                            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                                        ></textarea>
                                        <p className="text-xs text-gray-400 text-right">
                                            275 characters left
                                        </p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
                                        <button
                                            type="button"
                                            className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2 bg-[#5C2E1E] text-white rounded-md hover:bg-[#4a2415] transition"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* PASSWORD TAB */}
                        {activeTab === "password" && (
                            <div className="p-6 space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Password</h2>
                                    <p className="text-sm text-gray-500">
                                        Please enter your current password to change your password.
                                    </p>
                                </div>

                                {/* Current Password */}
                                <div className="border-b-2  border-gray-200 pb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                                    />
                                </div>

                                {/* New Password */}
                                <div className="border-b-2 border-gray-200 pb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                                    />
                                    <p className="text-sm text-gray-400 mt-2">
                                        Your new password must be more than 8 characters
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-[#5C2E1E] text-white rounded-md hover:bg-[#4a2415] transition"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
