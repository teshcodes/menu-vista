// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useGoogleRedirectLogin } from "../hooks/useGoogleRedirectLogin";
import { getBusinessProfile } from "../services/clearEssenceAPI";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc"
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { mutate: login, isLoading } = useLogin();
  const { mutate: googleLoginRedirect } = useGoogleRedirectLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    login(
      {
        email: formData.email.trim(),
        password: formData.password,
      },
      {
        onSuccess: async () => {
          toast.success("Login successfully");

          const authToken = localStorage.getItem("authToken");

          if (authToken) {
            try {
              const profile = await getBusinessProfile(authToken);

              if (profile.email) {
                localStorage.setItem("appUser", JSON.stringify(profile));


                if (!profile.businessName || !profile.type) {
                  toast.warning("Business profile incomplete. Please set up your business details on the dashboard.");
                }

              } else {
                console.warn("Basic profile missing email, skipping save to localStorage", profile);
                toast.warning("Could not retrieve basic profile data. Proceeding to dashboard.");
              }
            } catch (err: unknown) {
              console.error("Failed to load profile:", err);
              toast.warning("Could not retrieve business profile. Proceeding to dashboard.");
            }
          } else {
            console.error("Authentication token missing after successful login.");
            toast.error("Login successful but session could not be established.");
          }

          navigate("/dashboard");
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center flex items-center justify-center px-4 overflow-hidden md:overflow-auto"
      style={{ backgroundImage: "url('/restaurant-image.jpg')" }}
    >
      <div className="hidden md:block absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 bg-white w-full max-w-md rounded-2xl shadow-xl p-8 -mt-4">
        <div className="flex justify-center">
          <img src="/logo.png" alt="Logo" className="h-15 w-20 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 -mt-4">Welcome Back!</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border text-gray-700 border-gray-300 px-3 py-2"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password-field" className="block text-sm font-medium text-gray-600">
              Password
            </label>

            {/* Container for input and icon with relative positioning */}
            <div className="relative">
              <input
                id="password-field"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-700 focus:border-[#5C2E1E] focus:ring-[#5C2E1E] text-sm"
                placeholder="Enter your password"
              />

              {/* Eye Icon Button with absolute positioning */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm -mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#5C2E1E] text-white py-2 rounded-md hover:bg-[#4a2f19] transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Log in"}
          </button>
          <button
            type="button"
            onClick={() => googleLoginRedirect()}
            className="w-full bg-gray-100 text-black font-semibold py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            disabled
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#5C3A1E] font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}