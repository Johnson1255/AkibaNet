// src/components/FoodPage/index.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BottomNavBar from "@/components/BottomNavbar";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { Header } from "@/components/FoodPage/Header";
import { PolicyNotice } from "@/components/FoodPage/PolicyNotice";
import { ProductCard } from "@/components/FoodPage/ProductCard";
import { ConfirmButton } from "@/components/FoodPage/ConfirmButton";
import { useFetchFood } from "@/hooks/useFetchFood";
import { useToggleProduct } from "@/hooks/useToggleProduct";
import { useConfirmProducts } from "@/hooks/useConfirmProducts";

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
  const { theme } = useTheme();
  const [foodData, setFoodData] = useState<FoodData>({});
  const [selectedProducts, setSelectedProducts] = useState<Map<number, number>>(new Map());
  const [showPolicyNotice, setShowPolicyNotice] = useState(true);

  const { fetchFood } = useFetchFood(setFoodData);
  const { toggleProduct } = useToggleProduct(selectedProducts, setSelectedProducts);
  const { confirmProducts } = useConfirmProducts(selectedProducts, navigate);

  useEffect(() => {
    fetchFood();
  }, [fetchFood]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPolicyNotice(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const showButton = !!localStorage.getItem("lastReservation");

  return (
    <div className={`min-h-screen bg-background text-foreground pb-16 ${theme}`}>
      <Header />
      {showPolicyNotice && <PolicyNotice showButton={showButton} />}
      <div className="px-6">
        {Object.keys(foodData).map((category) => (
          <div key={category}>
            <h2 className="text-2xl font-bold mt-4 mb-4">
              {t(`food.${category}`)}
            </h2>
            <div className="space-y-3">
              {foodData[category].map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selectedProducts={selectedProducts}
                  toggleProduct={toggleProduct}
                  showButton={showButton}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {showButton && (
        <ConfirmButton confirmProducts={confirmProducts} />
      )}
      <BottomNavBar />
    </div>
  );
}