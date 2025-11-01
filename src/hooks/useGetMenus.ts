import { useQuery } from "@tanstack/react-query";
import { getMenus } from "../services/clearEssenceAPI";

interface GetMenusParams {
  skip?: number;
  take?: number;
  location?: string;
  search?: string;
}

export const useGetMenus = (params?: GetMenusParams) => {
  return useQuery({
    queryKey: ["menus", params],
    queryFn: async () => {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Unauthorized: Missing token");
      }

      // Combine params into query string automatically
      const queryParams = {
        skip: params?.skip ?? 0,
        take: params?.take ?? 20,
        ...(params?.location ? { location: params.location } : {}),
        ...(params?.search ? { search: params.search } : {}),
      };

      const data = await getMenus(queryParams, token);

      return data;
    },
    retry: 1, // retry once on failure
    refetchOnWindowFocus: false,
  });
};
