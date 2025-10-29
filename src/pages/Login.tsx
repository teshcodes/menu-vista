// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const { mutate: login, isLoading } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    login(
      {
        email: formData.email.trim(),
        password: formData.password,
      },
      {
        onSuccess: () => {
          // token is stored by the hook; navigate to dashboard
         console.log("it is successful in login page====")
          navigate("/dashboard");
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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

      <div className="relative z-10 bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-10 object-contain" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Log in</h2>

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

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border text-gray-700 border-gray-300 px-3 py-2"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#5C2E1E] text-white py-2 rounded-md hover:bg-[#4a2f19] transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#5C3A1E] font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
