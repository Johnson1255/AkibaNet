import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface Equipment {
  type: string;
  name: string;
  quantity: number;
}

interface DetailsCardProps {
  capacity: number;
  hourlyRate: number;
  equipment: Equipment[];
}

export function DetailsCard({ capacity, hourlyRate, equipment }: DetailsCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-6 rounded-2xl bg-card text-card-foreground">
      <h2 className="text-xl font-bold mb-4">
        {t("reservation.details", "Details")}
      </h2>
      <ul className="space-y-4">
        <li>
          {t("reservation.capacity", "Capacidad")}: {capacity}{" "}
          {t("reservation.people", "personas")}
        </li>
        <li>
          {t("reservation.hourlyRate", "Tarifa por hora")}: ¥
          {hourlyRate.toFixed(2)}
        </li>
        <li>
          {t("reservation.equipment", "Equipamiento")}:
          <ul className="ml-6 space-y-2 mt-2">
            {equipment.map((item, index) => (
              <li key={index}>
                {item.name}: {item.quantity}{" "}
                {item.quantity > 1
                  ? t("reservation.units", "unidades")
                  : t("reservation.unit", "unidad")}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </Card>
  );
}