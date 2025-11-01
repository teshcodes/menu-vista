import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/clearEssenceAPI";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  message?: string;
  data?: {
    accessToken?: string;
    token?: string;
  };
}

export const useLogin = () => {
  const mutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await loginUser(credentials);

      // Handle different backend token structures
      const accessToken =
        response?.data?.accessToken ||
        response?.data?.token ||
        response?.token;

        // const loggedInUser = response?.data?.user

      console.log("Token received:", accessToken);

      if (accessToken) {
        // Store it under a key your other hooks check
        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("token", accessToken);
        // localStorage.setItem("loggedInUser", loggedInUser);

      } else {
        console.warn("No access token found in login response.");
      }

      return response;
    },
    onError: (error) => {
      console.error("Login failed:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
    },
  });

  return {
    ...mutation,
    isLoading: mutation.status === "pending",
  } as typeof mutation & { isLoading: boolean };
};
