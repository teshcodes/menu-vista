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

export interface BackendMenuFile {
  name: string;
  url: string;
  size?: number;
  qrUrl?: string;
}

export interface BackendMenu {
  id: string;
  name: string;
  createdAt: string;
  description?: string;
  imageUrl?: string;
  category?: string;

  foodMenuFile?: BackendMenuFile;
  drinkMenuFile?: BackendMenuFile;
  spaMenuFile?: BackendMenuFile;
}

export interface MappedMenuFile {
  name: string;
  type: "PDF" | "IMG";
  url: string;
  size: number;
}

export interface MappedMenu {
  id: string;
  name: string;
  type: "PDF" | "IMG" | "MIXED";
  fileSize: number;
  createdAt: string;
  date: string;
  description: string;
  category: string;
  imageUrl: string;
  files: MappedMenuFile[];
  url?: string;
  qrUrl?: string;
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
      const token =
        localStorage.getItem("authToken") ??
        localStorage.getItem("token") ??
        localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication token is missing.");
        throw new Error("No token");
      }

      const queryParams = {
        skip: params?.skip ?? 0,
        take: params?.take ?? 20,
        category: params?.category ?? "",
        type: params?.type ?? "",
        ...(params?.search ? { search: params.search } : {}),
      };

      let response;
      try {
        response = await getMenus(queryParams, token);
      } catch (err) {
        toast.error("Failed to fetch menus.");
        throw err;
      }

      const backendData = response?.data;
      const rawMenus: BackendMenu[] = Array.isArray(backendData?.data)
        ? backendData.data
        : [];

      const mappedMenus: MappedMenu[] = rawMenus.map((menu) => {
        const files: MappedMenuFile[] = [];
        let fallbackUrl: string | undefined = undefined;
        let fallbackQr: string | undefined = undefined;

        // Use literal union so TypeScript knows these keys are the file fields
        const fileKeys: Array<'foodMenuFile' | 'drinkMenuFile' | 'spaMenuFile'> = [
          'foodMenuFile',
          'drinkMenuFile',
          'spaMenuFile',
        ];

        fileKeys.forEach((key) => {
          const file = menu[key] as BackendMenuFile | undefined;
          if (file?.name && file?.url) {
            const isPDF = file.name.toLowerCase().endsWith('.pdf');

            files.push({
              name: file.name,
              type: isPDF ? 'PDF' : 'IMG',
              url: file.url,
              size: file.size ?? 0,
            });

            if (!fallbackUrl) fallbackUrl = file.url;
            if (!fallbackQr && file.qrUrl) fallbackQr = file.qrUrl;
          }
        });

        const hasPDF = files.some((f) => f.type === 'PDF');
        const hasIMG = files.some((f) => f.type === 'IMG');

        const type: 'PDF' | 'IMG' | 'MIXED' =
          hasPDF && hasIMG ? 'MIXED' : hasPDF ? 'PDF' : 'IMG';

        const totalSize = files.reduce((sum, file) => sum + file.size, 0);

        return {
          id: menu.id,
          name: menu.name ?? 'Untitled',
          type,
          fileSize: totalSize,
          createdAt: menu.createdAt,
          date: new Date(menu.createdAt).toLocaleDateString(),
          description: menu.description ?? '',
          category: menu.category ?? '',
          imageUrl: menu.imageUrl ?? '',
          files,
          url: fallbackUrl,
          qrUrl: fallbackQr,
        };
      });

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
