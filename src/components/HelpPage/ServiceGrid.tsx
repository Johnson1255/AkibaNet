import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Wifi,
  Gamepad,
  SprayCanIcon as Spray,
  UtensilsCrossed,
  DoorClosed,
} from "lucide-react";

export const ServiceGrid = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const services = [
    {
      id: "food",
      title: t("help.food"),
      icon: (
        <div className="flex gap-1" onClick={() => navigate("/food")}>
          <UtensilsCrossed className="w-6 h-6" />
        </div>
      ),
      fullWidth: true,
    },
    {
      id: "wifi",
      title: t("help.wifiSupport"),
      icon: <Wifi className="w-6 h-6" />,
    },
    {
      id: "gaming",
      title: t("help.gamingSupport"),
      icon: <Gamepad className="w-6 h-6" />,
    },
    {
      id: "cleaning",
      title: t("help.cleaningService"),
      icon: <Spray className="w-6 h-6" />,
    },
    {
      id: "room",
      title: t("help.roomService"),
      icon: <DoorClosed className="w-6" />,
    },
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {services.map((service) => (
          <Card
            key={service.id} 
            className={`p-6 bg-card text-card-foreground border-0 flex flex-col items-center justify-center space-y-2
              ${service.fullWidth ? "col-span-2" : ""}`}
          >
            {service.icon}
            <span className="text-lg text-center">{service.title}</span>
          </Card>
        ))}
      </div>
    </div>
  );
};
