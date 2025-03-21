import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";

interface ProductsCardProps {
  products: Product[];
}

export const ProductsCard: React.FC<ProductsCardProps> = ({ products }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <Card className="mb-4 bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t("confirmation.products")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {products.length === 0 ? (
          <Button
            className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/food")}
          >
            {t("activeReservation.buyProducts")}
          </Button>
        ) : (
          products.map((product, index) => (
            <Badge key={index} variant="secondary">
              {product.name} - ${product.price} x {product.quantity}
            </Badge>
          ))
        )}
      </CardContent>
    </Card>
  );
};