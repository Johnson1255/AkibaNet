import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/types/services";

interface ServicesCardProps {
  services: Service[];
}

export const ServicesCard: React.FC<ServicesCardProps> = ({ services }) => {
  const { t } = useTranslation();

  if (services.length === 0) return null;

  return (
    <Card className="mb-4 bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t("confirmation.services")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {services.map((service, index) => (
          <Badge key={index} variant="secondary">
            {service.name} - ${service.price}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
};
