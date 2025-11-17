import { useQuery } from "@tanstack/react-query";
import { getBusinessProfile } from "../services/clearEssenceAPI";

export const useBusinessProfile = () => {
  return useQuery({
    queryKey: ["businessProfile"],
    queryFn: async () => {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken");

      if (!token) throw new Error("Missing auth token");

      // Wrap GET in try/catch in case backend doesn't support GET
      try {
        return await getBusinessProfile(token); // backend GET
      } catch (err) {
        console.warn("Business profile GET failed:", err);
        return null; // fallback gracefully
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes caching
  });
};
