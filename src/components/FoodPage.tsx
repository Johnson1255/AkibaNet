/**
 * @component FoodPage
 * @description Página que muestra los platos, snacks y bebidas disponibles en el menú.
 * Permite la navegación y muestra un botón de cierre de sesión.
 */
import {
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BottomNavBar from "./Bottom-navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function FoodPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-normal">{t("food.name")}</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      <Separator className="my-4" />

      {/* Plates */}
      <div className="px-6">
        <h2 className="text-2xl font-bold mt-4 mb-4">{t("food.plates")}</h2>
        <div className="space-y-3">
          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-normal">{t("food.food.plates.1.name")}</h3>
              <p className="text-gray-500">
                {t("food.food.plates.1.description")}
              </p>
            </div>
            <span className="text-lg">¥ 1700</span>
          </div>
          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-normal">{t("food.food.plates.2.name")}</h3>
              <p className="text-gray-500">
                {t("food.food.plates.2.description")}
              </p>
            </div>
            <span className="text-lg">¥ 1850</span>
          </div>
          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-normal">{t("food.food.plates.3.name")}</h3>
              <p className="text-gray-500">
                {t("food.food.plates.3.description")}
              </p>
            </div>
            <span className="text-lg">¥ 1850</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-4 mb-4">{t("food.snacks")}</h2>
        <div className="space-y-3">
          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-normal">{t("food.food.snacks.1.name")}</h3>
              <p className="text-gray-500">
                {t("food.food.snacks.1.description")}
              </p>
            </div>
            <span className="text-lg">¥ 1700</span>
          </div>
          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-normal">{t("food.food.snacks.2.name")}</h3>
              <p className="text-gray-500">
                {t("food.food.snacks.2.description")}
              </p>
            </div>
            <span className="text-lg">¥ 1700</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-4 mb-4">{t("food.drinks")}</h2>
        <div className="space-y-3">
          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-normal">{t("food.food.drinks.1.name")}</h3>
              <p className="text-gray-500">
                {t("food.food.drinks.1.description")}
              </p>
            </div>
            <span className="text-lg">¥ 1700</span>
          </div>
          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-normal">{t("food.food.drinks.2.name")}</h3>
              <p className="text-gray-500">
                {t("food.food.drinks.2.description")}
              </p>
            </div>
            <span className="text-lg">¥ 1700</span>
          </div>
        </div>
      </div>

      {/*Go to reserve Button */}
      <div className="px-6 py-4 flex-column items-center text-center">
        <h3 className="text-sm mb-2">{t("food.gotReservation")}</h3>
        <Button
          variant="default"
          className="w-full bg-black text-white rounded-xl h-12"
          onClick={() => navigate("/reserve")}
        >
          {t("food.button")} <LogOut className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <BottomNavBar />
    </div>
  );
}
