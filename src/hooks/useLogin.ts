import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/clearEssenceAPI";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  message: string;
}

export const useLogin = () => {
  const mutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await loginUser(credentials);

      // Store token in localStorage upon successful login
      const accessToken = response?.data?.accessToken
      console.log(accessToken, "this is accessToken here===")
      if (accessToken) {
        localStorage.setItem("authToken", accessToken);
      }

      return response;
    },
    onError: (error) => {
      console.error("Login failed:", error);
      localStorage.removeItem("authToken"); // Clear any existing token on error
    },
  });

  return {
    ...mutation,
    isLoading: mutation.status === "pending",
  } as typeof mutation & { isLoading: boolean };
};
