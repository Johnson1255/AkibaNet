import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { Card } from "../ui/card";

interface ServicesListProps {
  services?: Array<{ serviceId: string; price: number; name: string }>;
}

export const ServicesList: React.FC<ServicesListProps> = ({ services }) => {
  const { t } = useTranslation();
  if (!services || services.length === 0) return null;
  return (
    <>
      <Separator className="my-4" />
      <Card className="m-4 p-4 bg-card text-card-foreground">
        <h4 className="font-medium mb-2">{t("confirmation.services")}:</h4>
        <div className="space-y-2">
          {services.map((service, index) => (
            <div key={index} className="flex justify-between">
              <span>{service.name}</span> {/* Display service name */}
              <span>¥{service.price}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};
