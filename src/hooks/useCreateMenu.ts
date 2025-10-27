import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMenu } from "../services/clearEssenceAPI";
import type { MenuCreatePayload } from "../services/clearEssenceAPI";

type CreateMenuVariables = {
  menuData: MenuCreatePayload | FormData;
  token?: string | null;
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (variables: CreateMenuVariables) => {
      const { menuData, token: providedToken } = variables as CreateMenuVariables;

      const token =
        providedToken ??
        localStorage.getItem("token") ??
        localStorage.getItem("authToken") ??
        localStorage.getItem("accessToken");

      if (!token) throw new Error("Missing auth token for createMenu");

      const response = await createMenu(token, menuData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
  return {
    ...mutation,
    isLoading: mutation.status === "pending",
  } as typeof mutation & { isLoading: boolean };
};
