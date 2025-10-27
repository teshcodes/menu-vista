import { useQuery } from "@tanstack/react-query";
import { clearEssenceAPI } from "../services/clearEssenceAPI";

interface Menu {
  _id: string;
  name: string;
  type?: "PDF" | "IMG";
  link?: string;
  size?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

interface MenusResponse {
  menus: Menu[];
  total: number;
  message: string;
}

export const useMenus = (filters?: Record<string, string>) => {
  return useQuery<MenusResponse, Error>({
    queryKey: ["menus", filters],
    queryFn: () => clearEssenceAPI.getMenus(filters),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2, // Retry failed requests twice
  });
};
