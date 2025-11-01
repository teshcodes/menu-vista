// hooks/useUpdateMenu.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMenu } from "../services/clearEssenceAPI";
import type { MenuUpdatePayload } from "../services/clearEssenceAPI";

type UpdateMenuVariables = {
  id: string;
  data: MenuUpdatePayload;
  token?: string | null;
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: UpdateMenuVariables) => {
      const { id, data, token: providedToken } = variables;
      const token =
        providedToken ??
        localStorage.getItem("token") ??
        localStorage.getItem("authToken") ??
        localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Missing auth token for updateMenu");
      }

      const response = await updateMenu(token, id, data);
      return response;
    },
    onSuccess: () => {
      // Re-fetch menus (adjust key according to your queries)
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
};
