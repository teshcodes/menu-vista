// hooks/useChangePassword.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { axiosInstance } from "../services/clearEssenceAPI";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      const { data } = await axiosInstance.patch(
        "/user/change-password",
        {
          currentPassword: payload.currentPassword,
          newPassword: payload.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },

    onSuccess: () => {
      toast.success("Password updated successfully!");
    },

    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Failed to update password");
      } else {
        toast.error("Failed to update password");
      }
    },
  });
};
