// hooks/useUpdateBusinessProfile.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { axiosInstance } from "../services/clearEssenceAPI"; 

export const useUpdateBusinessProfile = () => {
  return useMutation({
    mutationFn: async (payload: {
      businessName: string;
      type: string;
      phoneNumber: string;
      email: string;
      address: string;
      openingHours: string;
      shortDescription: string;
      file: File | null;
    }) => {
      const formData = new FormData();
      formData.append("businessName", payload.businessName);
      formData.append("type", payload.type);
      formData.append("phoneNumber", payload.phoneNumber);
      formData.append("email", payload.email);
      formData.append("address", payload.address);
      formData.append("openingHours", payload.openingHours);
      formData.append("shortDescription", payload.shortDescription);

      if (payload.file) {
        formData.append("file", payload.file);
      }

      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      const { data } = await axiosInstance.patch(
        "/user/business-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Failed to update password");
      } else {
        toast.error("Failed to update password");
      }
    },
  });
};
