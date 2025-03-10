/**
 * Página de servicios de ayuda para los usuarios.
 * Permite solicitar servicios como comida, wifi, limpieza, videojuegos y servicio de habitación.
 * Incluye un área de comentarios y un botón para enviar solicitudes.
 * 
 * @module HelpServicesPage
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wifi,
  Gamepad,
  SprayCanIcon as Spray,
  Send,
  UtensilsCrossed,
  DoorClosed
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import BottomNavBar from "./Bottom-navbar";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

/**
 * Componente que renderiza la página de servicios de ayuda.
 * Permite a los usuarios solicitar diferentes tipos de asistencia en un hotel o aplicación similar.
 * 
 * @returns {JSX.Element} Página de servicios de ayuda.
 */
export default function HelpServicesPage() {
  /** Estado para almacenar los comentarios ingresados por el usuario */
  const [comments, setComments] = useState("");

  /** Hook de navegación de React Router */
  const navigate = useNavigate();

  /** Hook para manejar traducciones */
  const { t } = useTranslation();

  /** Hook para manejar el tema */
  const { theme } = useTheme();

  /** Lista de servicios disponibles */
  const services = [
    {
      id: "food",
      title: t("help.food"),
      icon: (
        <div className="flex gap-1 " onClick={() => navigate("/food")}>
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
    { id: "wifi", title: t("help.wifiSupport"), icon: <Wifi className="w-6 h-6" /> },
    { id: "gaming", title: t("help.gamingSupport"), icon: <Gamepad className="w-6 h-6" /> },
    { id: "cleaning", title: t("help.cleaningService"), icon: <Spray className="w-6 h-6" /> },
    { id: "room", title: t("help.roomService"), icon: <DoorClosed className="w-6" /> },
  ];

  /**
   * Maneja el envío de una solicitud de servicio.
   * Valida que el comentario no esté vacío antes de enviarlo.
   * 
   * @async
   * @function handleSendRequest
   */
  const handleSendRequest = async () => {
    if (!comments.trim()) {
      alert(t("help.noRequest"));
      return;
    }
    const token = localStorage.getItem('token');

    try {
      const requestBody = {
        description: comments
      };

      const response = await fetch("http://localhost:3000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(t("help.failedRequest"));

      alert(t("help.successfullRequest"));
      setComments(""); // Limpia el textarea después de enviar
    } catch (error) {
      if (error instanceof Error) {
        alert(t(error.message));
      } else {
        alert(t("help.error"));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Encabezado */}
      <header className="p-4 flex items-center justify-between bg-background border-b border-border">
        <Button onClick={() => navigate(-1)} variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-normal">{t("help.help")}</h1>
        <div className="w-10" /> {/* Espaciador para la alineación */}
      </header>

      {/* Grid de Servicios */}
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

      {/* Sección de Comentarios */}
      <div className="p-4 mt-8">
        <Card className="bg-card text-card-foreground border-0 p-6">
          <Textarea
            placeholder={t("help.requestPlaceholder")}
            className="bg-transparent border-0 resize-none min-h-[200px] text-lg placeholder:text-muted-foreground"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </Card>
      </div>

      {/* Botón de Enviar */}
      <div className="p-4 flex justify-center">
        <Button onClick={handleSendRequest} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-8">
          <Send className="mr-2 h-4 w-4" /> {t("help.sendRequest")}
        </Button>
      </div>
      
      {/* Barra de Navegación Inferior */}
      <BottomNavBar />
    </div>
  );
}
