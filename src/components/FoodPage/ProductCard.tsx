import type React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import type { ProductCardProps } from "@/types/product";

export const ProductCard: React.FC<ProductCardProps> = ({ product, selectedProducts, toggleProduct, showButton }) => {
  const handleToggle = () => {
    toggleProduct(product.id);
  };

  const selectedCount = selectedProducts.get(product.id) || 0;

  return (
    <Card
      className={`p-4 flex items-center justify-between ${
        selectedCount > 0 ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"
      }`}
    >
      <div>
        <h3 className="text-lg font-normal">{product.name}</h3>
        <p
          className={`text-sm ${selectedCount > 0 ? "text-primary-foreground" : "text-card-foreground"}`}
        >
          {product.description}
        </p>
      </div>
      {showButton && (
        <div className="flex items-center gap-4">
          <span className="text-lg whitespace-nowrap">¥ {product.price}</span>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={handleToggle}>
            {selectedCount > 0 ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </Button>
        </div>
      )}
    </Card>
  );
};
