import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/services/authService";

export const useUserProfile = () => {
  const { user, token, login } = useAuth();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token && (!user?.name || !user?.email)) {
        try {
          const profileData = await getUserProfile(token);
          
          if (profileData) {
            login(token, profileData);
          }
        } catch (error) {
          console.error("Error al obtener perfil del usuario:", error);
        }
      }
    };
    
    fetchUserProfile();
  }, [token, user, login]);
  
  return { user };
};