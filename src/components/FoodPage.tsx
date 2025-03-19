import { ArrowLeft, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BottomNavBar from "./Bottom-navbar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface FoodData {
  [key: string]: Product[];
}

export default function FoodPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [foodData, setFoodData] = useState<FoodData>({});
  const [selectedProducts, setSelectedProducts] = useState<Map<number, number>>(
    new Map()
  );
  const { theme } = useTheme();

  const lastReservation = localStorage.getItem("lastReservation");
  let showButton = true;
  if (lastReservation == null) {
    showButton = false;
  }

  useEffect(() => {
    fetch("http://localhost:3000/api/food")
      .then((res) => res.json())
      .then((data) => setFoodData(data))
      .catch((err) => console.error(err));
  }, []);

  const toggleProduct = (productId: number): void => {
    setSelectedProducts(
      (prevSelected: Map<number, number>): Map<number, number> => {
        const newSelected = new Map(prevSelected);
        const currentCount: number = newSelected.get(productId) || 0;
        if (currentCount < 5) {
          newSelected.set(productId, currentCount + 1);
        } else {
          newSelected.delete(productId);
        }
        return newSelected;
      }
    );
  };

  const confirmProducts = () => {
    const lastReservation = localStorage.getItem("lastReservation");
    if (lastReservation) {
      const reservation = JSON.parse(lastReservation);
      const productsArray = Array.from(selectedProducts.entries()).map(
        ([productId, quantity]) => {
          const product = Object.values(foodData)
            .flat()
            .find((p) => p.id === productId);
          return {
            productId,
            name: product?.name,
            price: product?.price,
            quantity,
          };
        }
      );
      reservation.products = productsArray;
      localStorage.setItem("lastReservation", JSON.stringify(reservation));
      navigate("/active-reservation");
    }
  };

  const renderProductCard = (product: Product) => (
    <Card
      key={product.id}
      className={`p-4 flex items-center justify-between ${
        selectedProducts.has(product.id)
          ? "bg-primary text-primary-foreground"
          : "bg-card text-card-foreground"
      }`}
    >
      <div>
        <h3 className="text-lg font-normal">{product.name}</h3>
        <p
          className={`text-sm ${
            selectedProducts.has(product.id)
              ? "text-primary-foreground"
              : "text-card-foreground"
          }`}
        >
          {product.description}
        </p>
      </div>
      {showButton && (
        <div className="flex items-center gap-4">
          <span className="text-lg whitespace-nowrap">¥ {product.price}</span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => toggleProduct(product.id)}
          >
            {selectedProducts.has(product.id) ? (
              <Minus className="h-6 w-6" />
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <div
      className={`min-h-screen bg-background text-foreground pb-16 ${theme}`}
    >
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-background border-b border-border">
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

      {/* Aviso de Política */}
      <div className="p-4 bg-yellow-200 text-yellow-800 text-center">
        {showButton ? t("food.policyNotice") : t("food.gotReservation")}
      </div>
      <Separator className="my-4" />

      <div className="px-6">
        {Object.keys(foodData).map((category) => (
          <div key={category}>
            <h2 className="text-2xl font-bold mt-4 mb-4">
              {t(`food.${category}`)}
            </h2>
            <div className="space-y-3">
              {foodData[category].map((product) => renderProductCard(product))}
            </div>
          </div>
        ))}
      </div>

      {/* Botón de Confirmar */}
      {showButton && (
        <div className="px-6 py-4 flex flex-col items-center text-center">
          <Button
            variant="default"
            className="w-full bg-primary text-primary-foreground rounded-xl h-12"
            onClick={confirmProducts}
          >
            {t("food.confirmButton")}
          </Button>
        </div>
      )}

      <BottomNavBar />
    </div>
  );
}
