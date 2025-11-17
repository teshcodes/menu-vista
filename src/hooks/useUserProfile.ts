import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/clearEssenceAPI";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken");

      if (!token) throw new Error("Missing auth token");

      return getUserProfile(token); // fetch /auth/profile
    },
    staleTime: 5 * 60 * 1000,
  });
};
