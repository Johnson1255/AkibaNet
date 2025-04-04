import type { ProductData, Product } from "@/types/product";

interface Reservation {
  productData: ProductData;
  products: Product[];
}

export const useConfirmProducts = (
  selectedProducts: Map<string, number>,
  navigate: (to: string) => void,
  productsList: Product[] // Added parameter to access product details
) => {
  const confirmProducts = () => {
    const lastReservation = localStorage.getItem("lastReservation");

    if (!lastReservation) {
      console.error("No reservation found in localStorage");
      alert("Falta información necesaria para la reserva.");
      navigate("/reserve");
      return;
    }

    try {
      const reservation: Reservation = JSON.parse(lastReservation);

      if (!reservation || !Array.isArray(reservation.products)) {
        throw new Error("Invalid reservation data");
      }

      // Initialize products array if it doesn't exist
      reservation.products = reservation.products || [];

      console.debug("Current reservation products:", reservation.products);

      const productsToAdd = Array.from(selectedProducts.entries())
        .map(([id, quantity]) => {
          const productInfo = productsList.find(p => p.id === id);
          if (!productInfo) {
            throw new Error(`Product with id ${id} not found`);
          }

          return {
            id: id,
            name: productInfo.name,
            price: productInfo.price,
            quantity: quantity,
            productId: productInfo.productId,
            category: productInfo.category
          };
        });

      // Update existing products or add new ones
      productsToAdd.forEach((newProduct) => {
        const existingProduct = reservation.products.find(
          (p) => p.id === newProduct.id
        );

        if (existingProduct) {
          existingProduct.quantity += newProduct.quantity;
        } else {
          reservation.products.push(newProduct);
        }
      });

      localStorage.setItem("lastReservation", JSON.stringify(reservation));
      navigate("/active-reservation");

    } catch (error) {
      console.error("Error processing reservation:", error);
      alert("Error al procesar la reserva. Por favor, intente nuevamente.");
      navigate("/reserve");
    }
  };

  return { confirmProducts };
};
