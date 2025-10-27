import { useMutation } from "@tanstack/react-query";
import { signupUser } from "../services/clearEssenceAPI";

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

interface SignupResponse {
  token: string;
  message: string;
}

export const useSignup = () => {
  return useMutation<SignupResponse, Error, SignupCredentials>({
    mutationFn: async (userData) => {
      const response = await signupUser({
        name: userData.name,  
        email: userData.email,
        password: userData.password,
      });
      
      // Store token in localStorage upon successful signup
      if (response?.token) {
        localStorage.setItem("authToken", response.token);
      }
      
      return response;
    },
    onError: (error) => {
      console.error("Signup failed:", error);
      localStorage.removeItem("authToken"); // Clear any existing token on error
    },
  });
};
