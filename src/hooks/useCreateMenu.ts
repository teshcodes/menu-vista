// src/hooks/useCreateMenu.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMenu } from "../services/clearEssenceAPI";
import type { MenuCreatePayload } from "../services/clearEssenceAPI";

interface CreateMenuVariables {
  menuData: MenuCreatePayload | FormData;
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

      if (!storedToken) throw new Error("Authentication required. Please log in again.");

      return await createMenu(storedToken, menuData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: (error) => {
      console.error("Menu creation failed:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.status === "pending",
  } as typeof mutation & { isLoading: boolean };
};
