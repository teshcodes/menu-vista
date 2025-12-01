import { useState, useEffect } from "react";
import { Mail, Phone, Upload, Clock, Building2 } from "lucide-react";
import SidebarNav from "../components/SidebarNav";
import { useUpdateBusinessProfile } from "../hooks/useUpdateBusinessProfile";
import { useChangePassword } from "../hooks/useChangePassword";
import { getBusinessProfile } from "../services/clearEssenceAPI";
import { useUser } from "../hooks/useUser";

// Define the shape of the business profile data
interface BusinessProfileForm {
  businessName: string;
  type: string;
  phoneNumber: string;
  email: string;
  address: string;
  timezone: string;
  openFrom: string;
  openTo: string;
  shortDescription: string;
  file?: string;
}

const MAX_DESCRIPTION_LENGTH = 275;

const toast = {
  error: (msg: string) => console.error(`[TOAST ERROR]: ${msg}`),
  success: (msg: string) => console.log(`[TOAST SUCCESS]: ${msg}`),
};

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Unknown error";
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const tabs = ["Profile", "Password", "Team", "Plan", "Billing", "Customize"];
  const disabledTabs = ["Team", "Plan", "Billing", "Customize"];
  const { setProfileImage } = useUser();

  const [form, setForm] = useState<BusinessProfileForm>({
    businessName: "",
    type: "",
    phoneNumber: "",
    email: "",
    address: "",
    timezone: "",
    openFrom: "",
    openTo: "",
    shortDescription: "",
    file: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const charactersRemaining = MAX_DESCRIPTION_LENGTH - form.shortDescription.length;

  // --- MUTATIONS ---
  const profileMutation = useUpdateBusinessProfile();
  const updateProfile = profileMutation.mutate;
  const { isPending: isProfilePending } = profileMutation;

  const changePasswordMutation = useChangePassword();
  const { mutate: changePasswordMutate, isPending: isPasswordPending } = changePasswordMutation;

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "shortDescription" && value.length > MAX_DESCRIPTION_LENGTH) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const openingHours = `(${form.timezone}) ${form.openFrom} - ${form.openTo}`;

    updateProfile(
      {
        businessName: form.businessName,
        type: form.type,
        phoneNumber: form.phoneNumber,
        email: form.email,
        address: form.address,
        openingHours,
        shortDescription: form.shortDescription,
        file: logoFile,
      },
      {
        onSuccess: (data) => {
          toast.success("Profile updated successfully!");

          // Update context if backend returns a logo URL
          const newLogo = data.logoUrl || data.file || null;
          if (newLogo) setProfileImage(newLogo);

          // Update form state to reflect latest saved data
          const openingParts = data.openingHours?.match(/\((.*?)\)\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
          setForm({
            businessName: data.businessName || "",
            type: data.type || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            address: data.address || "",
            timezone: openingParts?.[1] || "",
            openFrom: openingParts?.[2] || "",
            openTo: openingParts?.[3] || "",
            shortDescription: data.shortDescription || "",
            file: newLogo,
          });

          // Update logo preview
          if (logoFile) setLogoPreview(URL.createObjectURL(logoFile));

          // Exit edit mode
          setIsEditing(false);
        },
        onError: (error: unknown) =>
          toast.error(`Failed to update profile: ${getErrorMessage(error)}`),
      }
    );
  };


  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    changePasswordMutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Password changed successfully!");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error: unknown) => toast.error(`Password update failed: ${getErrorMessage(error)}`),
      }
    );
  };

  // --- EFFECTS ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      try {
        const data = await getBusinessProfile(token);
        const openingParts = data.openingHours?.match(/\((.*?)\)\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        setForm({
          businessName: data.businessName || "",
          type: data.type || "",
          phoneNumber: data.phoneNumber || "",
          email: data.email || "",
          address: data.address || "",
          timezone: openingParts?.[1] || "",
          openFrom: openingParts?.[2] || "",
          openTo: openingParts?.[3] || "",
          shortDescription: data.shortDescription || "",
        });
        setLogoPreview(data.logoUrl || null);
        if (data.logoUrl) setProfileImage(data.logoUrl);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, [setProfileImage]);

  useEffect(() => {
    if (!logoFile) return;
    const url = URL.createObjectURL(logoFile);
    setLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  // --- RENDER ---
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="md:w-64 md:h-screen md:sticky md:top-0 md:self-start">
        <SidebarNav />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-center items-start md:items-center">
          <div className="w-full max-w-3xl bg-white shadow-sm rounded-xl border border-gray-200">
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
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
                    <p className="text-sm text-gray-500">
                      Update details shown to guests and on your short link preview.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(!isEditing);      
                    }}
                    className="px-5 py-2 rounded-lg bg-[#5C2E1E] text-white hover:bg-[#4a2415] transition text-md"
                  >
                    {isEditing ? "Cancle" : "Edit Profile"}
                  </button>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={form.businessName}
                      onChange={handleChange}
                      placeholder="Crestabel Inc"
                      disabled={!isEditing}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <input
                      type="text"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      placeholder="Restaurant"
                      disabled={!isEditing}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                    />
                  </div>

                  {/* Phone + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="flex items-center border border-gray-300 rounded-md p-2.5">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                          type="text"
                          name="phoneNumber"
                          value={form.phoneNumber}
                          onChange={handleChange}
                          placeholder="+234 700 000 0000"
                          disabled={!isEditing}
                          className="w-full focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="flex items-center border border-gray-300 rounded-md p-2.5">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="support@crestsomething.com"
                          disabled={!isEditing}
                          className="w-full focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Logo</label>
                    <p className="text-sm text-gray-500 mb-2">This will be displayed on your profile.</p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {logoPreview ? (
                          <img src={logoPreview} alt="logo preview" className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                          <Building2 className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:bg-gray-50 transition">
                        <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                        <p className="text-xs text-gray-400">SVG, PNG, JPG, or GIF (max. 800×400px)</p>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Abuja"
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                    />
                  </div>

                  {/* Opening Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opening Hours</label>

                    <div className="mb-3">
                      <select
                        name="timezone"
                        value={form.timezone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                      >
                        <option value="">Select Timezone</option>
                        <option value="WAT">WAT (UTC+01:00)</option>
                        <option value="CAT">CAT (UTC+02:00)</option>
                        <option value="EAT">EAT (UTC+03:00)</option>
                        <option value="UTC">UTC (±00:00)</option>
                        <option value="CET">CET (UTC+01:00)</option>
                        <option value="EST">EST (UTC-05:00)</option>
                        <option value="PST">PST (UTC-08:00)</option>
                      </select>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex items-center border border-gray-300 rounded-md p-2.5 w-full">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                          type="time"
                          name="openFrom"
                          value={form.openFrom}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center border border-gray-300 rounded-md p-2.5 w-full">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                          type="time"
                          name="openTo"
                          value={form.openTo}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                    <textarea
                      name="shortDescription"
                      value={form.shortDescription}
                      onChange={handleChange}
                      placeholder="Elegant, touch-free fine dining for guests."
                      rows={3}
                      maxLength={MAX_DESCRIPTION_LENGTH}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                    />
                    <p className="text-xs text-gray-400 text-right">{charactersRemaining} characters left</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
                      onClick={() => {
                        // Reset form to last saved state
                        const token = localStorage.getItem("authToken");
                        if (!token) return;
                        getBusinessProfile(token).then((data) => {
                          const openingParts = data.openingHours?.match(/\((.*?)\)\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
                          setForm({
                            businessName: data.businessName || "",
                            type: data.type || "",
                            phoneNumber: data.phoneNumber || "",
                            email: data.email || "",
                            address: data.address || "",
                            timezone: openingParts?.[1] || "",
                            openFrom: openingParts?.[2] || "",
                            openTo: openingParts?.[3] || "",
                            shortDescription: data.shortDescription || "",
                            file: data.logoUrl || null,
                          });
                          setLogoPreview(data.logoUrl || null);
                        });

                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isProfilePending}
                      className="px-5 py-2 bg-[#5C2E1E] text-white rounded-md hover:bg-[#4a2415] transition"
                    >
                      {isProfilePending ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PASSWORD TAB */}
            {activeTab === "password" && (
              <form className="p-6 space-y-6" onSubmit={handlePasswordUpdate}>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Password</h2>
                  <p className="text-sm text-gray-500">Please enter your current password to change your password.</p>
                </div>

                <div className="border-b-2 border-gray-200 pb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                  />
                </div>

                <div className="border-b-2 border-gray-200 pb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                  />
                  <p className="text-sm text-gray-400 mt-2">Your new password must be more than 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#5C2E1E] focus:border-[#5C2E1E]"
                  />
                </div>

                <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
                    onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPasswordPending}
                    className="px-5 py-2 bg-[#5C2E1E] text-white rounded-md hover:bg-[#4a2415] transition"
                  >
                    {isPasswordPending ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
