import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../services/clearEssenceAPI";

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  // optional token to override stored token
  token?: string | null;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      // allow callers to pass token or fall back to common localStorage keys
      const token =
        payload.token ??
        localStorage.getItem("token") ??
        localStorage.getItem("authToken") ??
        localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Missing auth token for changing password");
      }

      const data = {
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
      };

      const response = await changePassword(token, data);
      return response;
    },
  });
};

 