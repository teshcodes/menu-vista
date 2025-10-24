// src/pages/Login.tsx
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "../lib/firebase";
import type { User } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const saveUserLocally = (u: User | null) => {
    if (!u) return;
    const userObj = { uid: u.uid, email: u.email, displayName: u.displayName || null };
    localStorage.setItem("appUser", JSON.stringify(userObj));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const getFriendlyError = (code: string): string => {
    switch (code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";
      default:
        return "Login failed. Please check your credentials and try again.";
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      saveUserLocally(cred.user);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(getFriendlyError(err.code));
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      saveUserLocally(res.user);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError("Google sign-in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/assets/restaurant-bg.jpg')" }}
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
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full bg-white text-black border border-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors duration-200"
            disabled={loading}
          >
            <FcGoogle size={20} /> Continue with Google
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
