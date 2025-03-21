import { useEffect } from "react";

export const useSyncSelectedServices = (
  selectedServices: Set<string>,
  reservationSelectedServices: Set<string> | undefined,
  updateSelectedServices: (services: Set<string>) => void
) => {
  useEffect(() => {
    const servicesArray = Array.from(selectedServices);
    if (!reservationSelectedServices || 
        servicesArray.length !== reservationSelectedServices.size || 
        !servicesArray.every(id => reservationSelectedServices?.has(id))) {
      updateSelectedServices(selectedServices);
    }
  }, [selectedServices, reservationSelectedServices, updateSelectedServices]);
};