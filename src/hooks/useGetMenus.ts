import { useQuery } from "@tanstack/react-query";
import { getMenus } from "../services/clearEssenceAPI";
import { toast } from "sonner";

interface GetMenusParams {
  skip?: number;
  take?: number;
  search?: string;
  type?: string;
  category?: string;
}

export interface BackendMenuResponse {
  status: string;
  statusCode: number;
  data: {
    data: BackendMenu[];
    total: number;
    page: number;
    size: number;
  };
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

// What the hook returns:
export interface MappedMenu {
  id?: string;
  name: string;
  type: "PDF" | "IMG";
  fileSize: number;
  createdAt: string;
  date: string;
  description: string;
  imageUrl: string;
  category: string;
  url?: string;
}

export interface MenuResult {
  menus: MappedMenu[];
  total: number;
  page: number;
  size: number;
}

export const useGetMenus = (params?: GetMenusParams) => {
  return useQuery<MenuResult>({
    queryKey: ["menus", params],
    queryFn: async () => {
      // Token
      const token =
        localStorage.getItem("authToken") ??
        localStorage.getItem("token") ??
        localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication token is missing. Please log in.");
        throw new Error("No auth token found. Please log in.");
      }

      // Query Params
      const queryParams = {
        skip: params?.skip ?? 0,
        take: params?.take ?? 20,
        category: params?.category ?? "",
        type: params?.type ?? "",
        ...(params?.search ? { search: params.search } : {}),
      };

      const response: BackendMenuResponse = await getMenus(queryParams, token);
      console.log("GET MENUS RAW RESPONSE =====>", response);

      const backendData = response?.data;

      const menuArray = Array.isArray(backendData?.data)
        ? backendData.data
        : [];

      const mappedMenus: MappedMenu[] = menuArray.map((menu: BackendMenu) => ({
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

      return {
        menus: mappedMenus,
        total: backendData?.total ?? 0,
        page: backendData?.page ?? 1,
        size: backendData?.size ?? 20,
      };
    },

    retry: 1,
    refetchOnWindowFocus: false,
  });
};
