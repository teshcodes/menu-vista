import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { handleGoogleCallback } from "../services/clearEssenceAPI";
import { toast } from "sonner";

export default function GoogleCallback() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (queryString: string) => {
      const data = await handleGoogleCallback(queryString);
      return data;
    },
    onSuccess: (data) => {
      const token =
        data?.token || data?.accessToken || data?.data?.token || data?.data?.accessToken;
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("token", token);
        toast.success("Logged in successfully with Google");
        navigate("/dashboard");
      } else {
        toast.error("No token found in callback response");
      }
    },
    onError: () => {
      toast.error("Google login failed");
      navigate("/login");
    },
  });

  useEffect(() => {
    const queryString = window.location.search; // e.g. ?code=xxx&scope=...
    if (queryString) {
      mutation.mutate(queryString);
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-700">Completing Google login...</p>
    </div>
  );
}
