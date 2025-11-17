import { createContext } from "react";

export interface UserContextType {
  profileImage: string | null;
  setProfileImage: (img: string | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
