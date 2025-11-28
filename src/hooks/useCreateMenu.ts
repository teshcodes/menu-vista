import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMenu } from "../services/clearEssenceAPI";
import { toast } from "sonner";

interface CreateMenuVariables {
  menuData: FormData;
  token?: string | null;
}

export const useCreateMenu = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ menuData, token }: CreateMenuVariables) => {
      const storedToken =
        token ??
        localStorage.getItem("token") ??
        localStorage.getItem("authToken") ??
        localStorage.getItem("accessToken");

      if (!storedToken) {
        throw new Error("Authentication required. Please log in again.");
      }

      // menuData is already FormData with correct fields
      return await createMenu(storedToken, menuData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"], exact: false });
      toast.success("Menu created successfully!");
    },

    onError: (error) => {
      toast.error("Menu creation failed");
      console.error("Menu creation failed:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.status === "pending",
  };
};
