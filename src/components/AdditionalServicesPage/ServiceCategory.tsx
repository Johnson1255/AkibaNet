// src/components/AdditionalServicesPage/ServiceCategory.tsx
import { ServiceCard } from "./ServiceCard";
import { ApiService } from "@/types/services";

interface ServiceCategoryProps {
  title: string;
  services: ApiService[];
  selectedServices: Set<string>;
  toggleService: (serviceId: string) => void;
}

export const ServiceCategory: React.FC<ServiceCategoryProps> = ({ title, services, selectedServices, toggleService }) => {
  return (
    <div>
      <h2 className="text-2xl mb-4">{title}</h2>
      <div className="space-y-4">
        {services.map(service => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            isSelected={selectedServices.has(service.id)} 
            toggleService={toggleService} 
          />
        ))}
      </div>
    </div>
  );
};