import { useState } from "react";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BottomNavBar from "./Bottom-navbar";

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  isConsole?: boolean;
}

export default function AdditionalServices() {
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set(["refrigerator"])
  );
  const baseHours = 3;
  const hourlyRate = 800;

  const services: Service[] = [
    { id: "headset", name: "Premium gaming headsets", price: 150 },
    {
      id: "streaming",
      name: "Streaming Setup",
      description: "webcam and microphone for streamers.",
      price: 500,
    },
    {
      id: "refrigerator",
      name: "Small refrigerator",
      description: "For cold drinks and snacks",
      price: 500,
    },
    {
      id: "chair",
      name: "Ergonomic gaming chair",
      description: "Adjustable and comfortable for long sessions.",
      price: 500,
    },
  ];

  const consoles: Service[] = [
    { id: "ps5", name: "Playstation 5", price: 100, isConsole: true },
    { id: "dreamcast", name: "Sega Dreamcast", price: 250, isConsole: true },
    { id: "n64", name: "Nintengod 64", price: 350, isConsole: true },
  ];

  const toggleService = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  const calculateTotal = () => {
    const servicesTotal = [...services, ...consoles]
      .filter((service) => selectedServices.has(service.id))
      .reduce((sum, service) => sum + service.price, 0);
    return servicesTotal + baseHours * hourlyRate;
  };

  const renderServiceCard = (service: Service) => (
    <Card
      key={service.id}
      className={`p-4 flex items-center justify-between ${
        selectedServices.has(service.id) ? "bg-gray-800 text-white" : "bg-white"
      }`}
    >
      <div>
        <h3 className="text-lg font-normal">{service.name}</h3>
        {service.description && (
          <p
            className={`text-sm ${
              selectedServices.has(service.id)
                ? "text-gray-300"
                : "text-gray-500"
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
          {selectedServices.has(service.id) ? (
            <Minus className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </Button>
      </div>
    </Card>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-16">
        {/* Header */}
        <header className="p-4 flex items-center justify-between bg-white">
          <Button variant="ghost" size="icon" className="rounded-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-normal">Additional Services</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </header>

        {/* Services List */}
        <div className="p-4 space-y-4">
          {services.map(renderServiceCard)}

          <div className="mt-8">
            <h2 className="text-2xl mb-4">Console rental</h2>
            <div className="space-y-4">{consoles.map(renderServiceCard)}</div>
            <p className="text-sm text-gray-500 mt-2">
              * Each console has its own library of games available
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bottom-0 left-0 right-0">
          <div className="bg-gray-200 p-4 space-y-2">
            {Array.from(selectedServices).map((serviceId) => {
              const service = [...services, ...consoles].find(
                (s) => s.id === serviceId
              );
              if (!service) return null;
              return (
                <div key={serviceId} className="flex justify-between">
                  <span>1 x {service.name}</span>
                  <span className="whitespace-nowrap">¥ {service.price}</span>
                </div>
              );
            })}
            <div className="flex justify-between">
              <span>{baseHours} x Hours</span>
              <span className="whitespace-nowrap">¥ {baseHours * hourlyRate}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>TOTAL</span>
              <span className="whitespace-nowrap">¥ {calculateTotal()}</span>
            </div>
          </div>
          <Button className="w-full h-14 rounded-none bg-black text-white hover:bg-black/90">
            Confirm and Pay
          </Button>
        </div>
      </div>
      <BottomNavBar />
    </>
  );
}
