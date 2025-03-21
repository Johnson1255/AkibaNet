import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

export function useUserName() {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  return user?.name || t('account.profile.defaultUser');
}
