import axios from "axios";

/* -------------------- AXIOS INSTANCE -------------------- */
export const axiosInstance = axios.create({
  baseURL: "https://clear-essence-backend.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

/* -------------------- AUTHENTICATION -------------------- */

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
  const { data } = await axiosInstance.post("/auth/signup", payload);
  return data;
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);
  return data;
};

export const logout = async (token: string) => {
  const { data } = await axiosInstance.post(
    "/auth/logout",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

/* -------------------- USER PROFILE -------------------- */

export const getBusinessProfile = async (token: string) => {
  const { data } = await axiosInstance.get("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const changePassword = async (
  token: string,
  payload: { oldPassword: string; newPassword: string }
) => {
  const { data } = await axiosInstance.patch("/user/change-password", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

/* -------------------- MENU TYPES -------------------- */

export interface MenuCreatePayload {
  name: string;
  type?: "PDF" | "IMG";
  file?: File | null;
  link?: string;
  size?: string;
  location?: string;
}

export type MenuUpdatePayload = Partial<MenuCreatePayload> | FormData;

/* -------------------- MENU MANAGEMENT -------------------- */

// Create Menu
export const createMenu = async (
  token: string,
  menuData: MenuCreatePayload | FormData
) => {
  const isFormData = menuData instanceof FormData;

  const { data } = await axiosInstance.post("/menu", menuData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": isFormData
        ? "multipart/form-data"
        : "application/json",
    },
  });

  return data;
};

// Get All Menus
export const getMenus = async (params?: Record<string, string | number>, token?: string,) => {
  const { data } = await axiosInstance.get("/menu/user", {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

// Get Menu by ID
export const getMenuById = async (id: string, token?:string) => {
  const { data } = await axiosInstance.get(`/menu/${id}`,  {headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }});
  return data;
};

//  Update Menu 
export const updateMenu = async (
  token: string,
  id: string,
  updates: MenuUpdatePayload
) => {
  try {
    const isFormData = updates instanceof FormData;

    const { data } = await axiosInstance.put(`/menu/${id}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": isFormData
          ? "multipart/form-data"
          : "application/json",
      },
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error updating menu ${id}:`, error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

// Delete Menu
export const deleteMenu = async (token: string, id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/menu/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error deleting menu ${id}:`, error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

/* -------------------- API WRAPPER (optional) -------------------- */
export const clearEssenceAPI = {
  signup: signupUser,
  login: loginUser,
  logout,
  getBusinessProfile,
  changePassword,
  createMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
};

export default axiosInstance;
