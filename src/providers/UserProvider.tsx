import { useState } from "react";
import { UserContext } from "../context/UserContext";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </UserContext.Provider>
  );
};
