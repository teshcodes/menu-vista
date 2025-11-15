import { useQuery } from "@tanstack/react-query";
import { getMenus } from "../services/clearEssenceAPI";

interface GetMenusParams {
  skip?: number;
  take?: number;
  search?: string;
  type?: string;
  category?: string;
}

interface BackendMenu {
  id?: string;
  name: string;
  type?: "PDF" | "IMG";
  fileSize?: number | string;
  createdAt: string;
  description?: string;
  imageUrl?: string;
  category?: string;
}


export const useGetMenus = (params?: GetMenusParams) => {
  return useQuery({
    queryKey: ["menus", params],
    queryFn: async () => {
      // Get token from localStorage
      const token =
        localStorage.getItem("authToken") ??
        localStorage.getItem("token") ??
        localStorage.getItem("accessToken")

      if (!token) {
        throw new Error("No auth token found. Please log in.");
      }

      // Build query params
      const queryParams = {
        skip: params?.skip ?? 0,
        take: params?.take ?? 20,
        category: params?.category ?? "",
        type: params?.type ?? "",
        ...(params?.search ? { search: params.search } : {}),
      };

      const response = await getMenus(queryParams, token);
      console.log("GET MENUS RAW RESPONSE: =====>", response);

      const menuArray = Array.isArray(response?.data?.data) ? response.data.data : [];

      // Map backend response to our MenuItem interface
      return menuArray.map((menu: BackendMenu) => ({
        id: menu.id,
        name: menu.name,
        type: menu.type || "PDF",
        fileSize: Number(menu.fileSize || 0),
        createdAt: menu.createdAt,
        date: new Date(menu.createdAt).toLocaleDateString(),
        description: menu.description || "",
        imageUrl: menu.imageUrl || "",
        category: menu.category || "",
      }));

    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
