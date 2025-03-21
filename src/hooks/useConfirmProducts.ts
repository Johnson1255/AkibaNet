// src/components/FoodPage/useConfirmProducts.ts

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface ReservationProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface FoodData {
  [key: string]: Product[];
}

export const useConfirmProducts = (selectedProducts: Map<number, number>, navigate: (to: string) => void) => {

  const confirmProducts = () => {
    const lastReservation = localStorage.getItem("lastReservation");
    if (lastReservation) {
      const reservation = JSON.parse(lastReservation);
      const productsArray = Array.from(selectedProducts.entries()).map(
        ([id, quantity]) => {
          const product = Object.values(reservation.foodData)
            .flat()
            .find((p: Product) => p.id === id);
          return {
            id,
            name: product?.name,
            price: product?.price,
            quantity,
          };
        }
      );

      // Append new products to the existing ones
      reservation.products = reservation.products || [];
      productsArray.forEach((newProduct) => {
        const existingProduct: ReservationProduct | undefined = reservation.products.find(
          (p: ReservationProduct) => p.id === newProduct.id
        );
        if (existingProduct) {
          existingProduct.quantity += newProduct.quantity;
        } else {
          reservation.products.push(newProduct);
        }
      });

      localStorage.setItem("lastReservation", JSON.stringify(reservation));
      navigate("/active-reservation");
    } else {
      alert("Falta información necesaria para la reserva.");
      navigate("/reserve");
    }
  };

  return { confirmProducts };
};