import BottomNavBar from "@/components/common/BottomNavbar";
import WelcomeSection from "./WelcomeSection";
import ActionButtons from "./ActionButtons";
import NewsSection from "./NewsSection";
import { useUserName } from "../../hooks/useUserName";

export default function CafeHome() {
  const userName = useUserName();

  return (
    <>
      <div className="min-h-screen bg-background text-foreground pb-20">
        <WelcomeSection userName={userName} />
        <ActionButtons />
        <NewsSection />
      </div>
      <BottomNavBar />
    </>
  );
}
