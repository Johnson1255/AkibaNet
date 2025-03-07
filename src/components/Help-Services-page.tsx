import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wifi,
  Gamepad,
  SprayCanIcon as Spray,
  Send,
  UtensilsCrossed, DoorClosed 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import BottomNavBar from "./Bottom-navbar";

export default function HelpServicesPage() {
  const [comments, setComments] = useState("");
  const navigate = useNavigate();

  const services = [
    {
      id: "food",
      title: "Drinks, Food & Snacks",
      icon: (
        <div className="flex gap-1">
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 flex items-end">
              <div className="w-4 h-5 bg-current rounded-sm" />
              <div className="w-2 h-3 bg-current" />
            </div>
          </div>
          <UtensilsCrossed className="w-6 h-6" />
        </div>
      ),
      fullWidth: true,
    },
    { id: "wifi", title: "Wifi Support", icon: <Wifi className="w-6 h-6" /> },
    { id: "gaming", title: "Gaming Support", icon: <Gamepad className="w-6 h-6" /> },
    { id: "cleaning", title: "Cleaning service", icon: <Spray className="w-6 h-6" /> },
    { id: "room", title: "Room Service", icon: <DoorClosed className=" w-6"/> },
  ];

  const handleSendRequest = async () => {
    if (!comments.trim()) {
      alert("Please enter a request before sending.");
      return;
    }
  
    try {
      const requestBody = {
        user_id: "a5d90c68-e574-4d7d-90a4-4da6fe0fa1f5", // Cambia esto según el usuario
        date: new Date().toISOString(),
        description: comments, // Se corrigió el nombre de la clave
      };
  
      const response = await fetch("http://localhost:3000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) throw new Error("Failed to send request.");
  
      alert("Request sent successfully!");
      setComments(""); // Limpia el textarea después de enviar
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button onClick={() => navigate(-1)} variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-6 w-6" />
          
        </Button>
        <h1 className="text-2xl font-normal">Help & Services</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      {/* Services Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`p-6 bg-gray-100 border-0 flex flex-col items-center justify-center space-y-2
                ${service.fullWidth ? "col-span-2" : ""}`}
            >
              {service.icon}
              <span className="text-lg text-center">{service.title}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="p-4 mt-8">
        <Card className="bg-gray-100 border-0 p-6">
          <Textarea
            placeholder="Any specific requests or comments?"
            className="bg-transparent border-0 resize-none min-h-[200px] text-lg placeholder:text-gray-500"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </Card>
      </div>

      {/* Send Button */}
      <div className="p-4 flex justify-center">
        <Button
          onClick={handleSendRequest}
          className="bg-gray-100 hover:bg-gray-200 text-black rounded-xl h-12 px-8"
        >
          <Send className="mr-2 h-4 w-4" /> Send Request
        </Button>
      </div>
      <BottomNavBar />
    </div>
  );
}
