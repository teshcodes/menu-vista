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

      if (!token) {
        throw new Error("Missing auth token for fetching business profile");
      }

      return getBusinessProfile(token);
    },
  });
};


 

