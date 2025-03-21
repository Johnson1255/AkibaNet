
import { Separator } from "@/components/ui/separator";
import BottomNavBar from "@/components/common/BottomNavbar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useUserProfile } from "@/hooks/useUserProfile";

import { Header } from "@/components/common/Header";
import { ProfileSection } from "./ProfileSection";
import { ReservationHistory } from "./ReservationHistory";
import { SettingsSection } from "./SettingsSection";
import { LogoutButton } from "./LogoutButton";

// Datos de ejemplo (en una aplicación real, esto vendría de una API)
const SAMPLE_RESERVATIONS = [
  {
    id: "1",
    roomName: "Gaming Room #24",
    date: "2025-01-15",
    hours: 2,
    price: 1700
  },
  {
    id: "2",
    roomName: "Gaming Room #5",
    date: "2025-01-18",
    hours: 2,
    price: 1700
  }
];

export default function AccountPage() {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { user } = useUserProfile();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };
  
  const handleViewAllReservations = () => {
    // Implementar navegación a la página de historial completo
    console.log("Ver todas las reservaciones");
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <Header title={t("account.title")} showBackButton={true} />
      <ProfileSection user={user} />
      <Separator className="my-4" />
      <ReservationHistory 
        reservations={SAMPLE_RESERVATIONS} 
        onViewAll={handleViewAllReservations} 
      />
      <SettingsSection 
        theme={theme}
        language={i18n.language}
        onLanguageChange={handleLanguageChange}
        onThemeChange={toggleTheme}
      />
      <LogoutButton onLogout={handleLogout} />
      <BottomNavBar />
    </div>
  );
}