import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const { mutate: signup, isPending } = useSignup();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    signup(
      {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      },
      {
        onSuccess: (response) => {
          if (response?.token) {
            localStorage.setItem("authToken", response.token);
          }
          navigate("/dashboard", { replace: true });
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : "Failed to create account");
          localStorage.removeItem("authToken"); // Clear any existing token on error
        }
      }
    );
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/restaurant-image.jpg')" }}
    >
      {/* Background overlay for desktop */}
      <div className="hidden md:block absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-10 object-contain" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Sign up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border text-gray-700 border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5C2E1E]"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border text-gray-700 border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5C2E1E]"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border text-gray-700 border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5C2E1E]"
              placeholder="Create a password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters.
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#5C2E1E] text-white py-2 rounded-md hover:bg-[#4a2f19] transition-colors duration-200"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create account"}
          </button>
        </form>

        {/* Switch to Login */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#5C3A1E] font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
