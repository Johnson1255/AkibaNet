import { UserIcon } from "lucide-react";
import { UserProfile } from "@/types/user";
import { useTranslation } from "react-i18next";

interface ProfileSectionProps {
  user: UserProfile | null;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const { t } = useTranslation();
  
  return (
    <div className="px-6 py-4 flex items-center gap-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <UserIcon className="w-8 h-8 text-gray-400" />
      </div>
      <div>
        <h2 className="text-xl font-normal">{user?.name || t('account.profile.defaultUser')}</h2>
        <p className="text-gray-500">{user?.email || t('errors.emailNotAvailable')}</p>
      </div>
    </div>
  );
};