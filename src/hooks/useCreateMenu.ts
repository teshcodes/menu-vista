import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMenu } from "../services/clearEssenceAPI";
import type { MenuCreatePayload } from "../services/clearEssenceAPI";
import { toast } from "sonner";

interface CreateMenuVariables {
  menuData: MenuCreatePayload | FormData;
  token?: string | null;
}

export const useCreateMenu = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ menuData, token }: CreateMenuVariables) => {
      // Get stored token from any possible key
      const storedToken =
        token ??
        localStorage.getItem("token") ??
        localStorage.getItem("authToken") ??
        localStorage.getItem("accessToken");

      if (!storedToken) {
        throw new Error("Authentication required. Please log in again.");
      }

      // Convert Payload → FormData when needed
      if (!(menuData instanceof FormData)) {
        const fd = new FormData();

        if (menuData.name) fd.append("name", menuData.name);
        if (menuData.category) fd.append("category", menuData.category);
        if (menuData.description) fd.append("description", menuData.description);
        if (menuData.type) fd.append("type", menuData.type);
        if (menuData.file) fd.append("file", menuData.file);

        menuData = fd;
      }

      return await createMenu(storedToken, menuData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus", { skip: 0, take: 20 }], exact: false });
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
