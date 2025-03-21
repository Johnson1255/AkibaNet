import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { ServiceCardProps } from "@/types/services";
import { Card, CardContent } from "@/components/ui/card";

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSelected, toggleService }) => {
  return (
    <Card className={`${isSelected ? "bg-primary text-primary-foreground" : ""}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-normal">{service.name}</h3>
          {service.description && (
            <p
              className={`text-sm ${
                isSelected ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {service.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg whitespace-nowrap">¥ {service.price}</span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => toggleService(service.id)}
          >
            {isSelected ? (
              <Minus className="h-6 w-6" />
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};