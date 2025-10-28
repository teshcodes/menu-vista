import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://clear-essence-backend.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- AUTHENTICATION ----------------

// Sign up user
export const signupUser = async (userData: {
  name?: string;
  Name?: string;
  email: string;
  password: string;
}) => {
  const payload = {
    name: userData.Name ?? userData.name ?? "",
    email: userData.email,
    password: userData.password,
  };
  const response = await axiosInstance.post("/auth/signup", payload);
  return response.data;
};

// Login user
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
};

// ---------------- USER PROFILE ----------------

// Get business profile
export const getBusinessProfile = async (token: string) => {
  const response = await axiosInstance.get("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Change password
export const changePassword = async (
  token: string,
  data: { oldPassword: string; newPassword: string }
) => {
  const response = await axiosInstance.patch("/user/change-password", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const logout = async (token: string) => {
  const response = await axiosInstance.post(
    "/auth/logout",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// ---------------- MENU MANAGEMENT ----------------

// Create new menu
/**
 * Payload used to create a menu. If uploading a file, prefer sending as FormData.
 */
export interface MenuCreatePayload {
  name: string;
  type?: "PDF" | "IMG";
  // Optional file when sending as multipart/form-data
  file?: File | null;
  // Optional URL to the menu if already hosted
  link?: string;
  size?: string;
  location?: string;
}


export const createMenu = async (
  token: string,
  menuData: MenuCreatePayload | FormData
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(menuData instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" }),
  };

  const response = await axiosInstance.post("/menu", menuData, { headers });
  return response.data;
};


// Get all menus (with optional filters)
export const getMenus = async (params?: Record<string, string | number>) => {
  const response = await axiosInstance.get("/menu", { params });
  return response.data;
};

// Get a single menu by ID
export const getMenuById = async (id: string) => {
  const response = await axiosInstance.get(`/menu/${id}`);
  return response.data;
};

// Update a menu item
export type MenuUpdatePayload = Partial<MenuCreatePayload> | FormData;

export const updateMenu = async (
  token: string,
  id: string,
  updates: MenuUpdatePayload
) => {
  const isFormData = updates instanceof FormData;
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
  };

  const response = await axiosInstance.patch(`/menu/${id}`, updates as unknown as Record<string, unknown>, {
    headers,
  });
  return response.data;
};

// Delete a menu
export const deleteMenu = async (token: string, id: string) => {
    try {
        const response = await axiosInstance.delete(`/menu/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error deleting Menu with id ${id}:`, error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
        console.error(`Unknown error deleting Menu with id ${id}:`, error);
        throw error;
    }
};

// Grouped convenience object (optional) so callers can use clearEssenceAPI.signup(...) style
export const clearEssenceAPI = {
  signup: signupUser,
  login: loginUser,
  getBusinessProfile,
  changePassword,
  createMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  logout,
};

// Named export for axios instance and keep default export for backwards compatibility
export { axiosInstance };

export default axiosInstance;
