import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMenu } from "../services/clearEssenceAPI";

type DeleteMenuVariables = {
  id: string;
  token?: string | null;
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: DeleteMenuVariables) => {
      const { id, token: providedToken } = variables as DeleteMenuVariables;

      const token =
        providedToken ??
        localStorage.getItem("token") ??
        localStorage.getItem("authToken") ??
        localStorage.getItem("accessToken");

      if (!token) throw new Error("Missing auth token for deleteMenu");

      const response = await deleteMenu(token, id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
};
