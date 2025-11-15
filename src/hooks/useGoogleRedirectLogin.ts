import { useMutation } from "@tanstack/react-query";
import { getGoogleAuthUrl } from "../services/clearEssenceAPI";

export const useGoogleRedirectLogin = () => {
  return useMutation({
    mutationFn: async () => {
      const url = await getGoogleAuthUrl();
      // Open Google OAuth login
      window.location.href = url;
    },
  });
};
