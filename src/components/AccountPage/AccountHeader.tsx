import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AccountHeaderProps {
  title: string;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <header className="p-4 flex items-center justify-between">
      <Button onClick={() => navigate(-1)} variant="ghost" size="icon" className="rounded-full">
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-2xl font-normal">{title}</h1>
      <div className="w-10" /> {/* Spacer for alignment */}
    </header>
  );
};