import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "../lib/firebase";
import type { User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { updateProfile } from "firebase/auth"; 

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Save minimal user info locally 
  const saveUserLocally = (u: User | null) => {
    if (!u) return;
    const userObj = {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName || formData.name,
    };
    localStorage.setItem("appUser", JSON.stringify(userObj));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Handle email/password signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      //  Update Firebase user profile with name
      await updateProfile(cred.user, {
        displayName: formData.name.trim(),
      });

      saveUserLocally(cred.user);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError("Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  //  Handle Google sign-in
  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      saveUserLocally(result.user);
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
              placeholder="Enter your Gmail"
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
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          {/* Google Signup */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full bg-white text-black border border-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors duration-200"
            disabled={loading}
          >
            <FcGoogle size={20} /> Sign up with Google
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
