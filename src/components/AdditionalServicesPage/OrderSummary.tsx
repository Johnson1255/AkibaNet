// src/components/AdditionalServicesPage/OrderSummary.tsx
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { OrderSummaryProps } from "@/types/services";
export const OrderSummary: React.FC<OrderSummaryProps> = ({
  roomId,
  baseRoomPrice,
  selectedServices,
  calculateTotal,
}) => {
  const { t } = useTranslation();
  return (
    <div className="bottom-0 left-0 right-0">
      <div className="bg-secondary p-4 space-y-2">
        <div className="flex justify-between">
          <span>
            {t("reservation.room")} #{roomId}
          </span>
          <span className="whitespace-nowrap">¥ {baseRoomPrice}</span>
        </div>
        {selectedServices.map((service) => (
          <div key={service.id} className="flex justify-between">
            <span>1 x {service.name}</span>
            <span className="whitespace-nowrap">¥ {service.price}</span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between font-bold">
          <span>{t("common.total")}</span>
          <span className="whitespace-nowrap">¥ {calculateTotal()}</span>
        </div>
      </div>
    </div>
  );
};
