// src/hooks/useDeleteMenu.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMenu } from "../services/clearEssenceAPI";
import { toast } from "sonner";

type DeleteMenuVariables = {
  id: string;
  token?: string | null;
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, token: providedToken }: DeleteMenuVariables) => {
      const token =
        providedToken ??
        localStorage.getItem("token") ??
        localStorage.getItem("authToken") ??
        localStorage.getItem("accessToken");

      if (!token) throw new Error("Missing auth token for deleteMenu");

      return await deleteMenu(token, id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Menu deleted successfully!");
    },

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Error deleting menu:", error.message);
        toast.error(error.message || "Failed to delete menu. Please try again.");
      } else if (typeof error === 'object' && error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        console.error("Error deleting menu:", axiosError.response?.data?.message);
        toast.error(
          axiosError.response?.data?.message || "Failed to delete menu. Please try again."
        );
      } else {
        console.error("Unknown error deleting menu");
        toast.error("Failed to delete menu. Please try again.");
      }
    },
  });
};
