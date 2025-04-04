// src/hooks/useFetchFood.ts
import React, { useCallback } from 'react';
import type { ProductData, Product } from "@/types/product";

export const useFetchFood = (
  setFoodData: React.Dispatch<React.SetStateAction<ProductData>>
  // Añade setError si quieres manejar errores de fetch en el UI
  // setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const fetchFood = useCallback(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}: Error al obtener productos`);
        }
        return res.json();
      })
      .then((data: any[]) => { // Espera un array del backend
        if (!Array.isArray(data)) {
          console.error("Expected an array of products, but received:", data);
          throw new Error("Formato de datos inesperado del servidor.");
        }

        const categorizedData: ProductData = {
          beverage: [],
          snack: [],
          other: [],
        };

        data.forEach((productDoc) => {
          const category = productDoc.category;

          // --- MAPEO MÁS ROBUSTO ---
          let uniqueId: string | null = null;
          if (productDoc._id) {
             uniqueId = productDoc._id.toString(); // Prioridad 1: _id de MongoDB
          } else if (productDoc.productId) {
             uniqueId = productDoc.productId;     // Prioridad 2: productId propio
          }

          if (!uniqueId) {
             console.error("Product is missing a unique identifier (_id or productId):", productDoc);
             // Saltar este producto o asignarle un ID temporal MUY cuidadosamente
             // uniqueId = `temp-${Math.random()}`; // ¡Esto causará problemas de key si se usa! Mejor saltarlo.
             return; // Saltar este producto si no tiene ID
          }
          // --- FIN MAPEO MÁS ROBUSTO ---

          const frontendProduct: Product = {
            id: uniqueId, // Asignar el ID único encontrado
            productId: productDoc.productId,
            name: productDoc.name,
            description: productDoc.description,
            price: productDoc.price,
            category: productDoc.category,
            // Asegúrate que otros campos necesarios por 'Product' estén aquí
          };

          if (category && categorizedData.hasOwnProperty(category)) {
            categorizedData[category].push(frontendProduct);
          } else {
            console.warn(`Product with ID ${frontendProduct.id} has unknown or missing category: ${category}. Adding to 'other'.`);
             if (!categorizedData.other) categorizedData.other = []; // Asegura que 'other' exista
             categorizedData.other.push(frontendProduct);
          }
        });

        setFoodData(categorizedData);
      })
      .catch((err) => {
        console.error("Error fetching or processing food data:", err);
        // setError(err.message || 'Failed to load products'); // Actualiza estado de error si existe
      });
  }, [setFoodData /*, setError */]); // Añade setError si lo usas

  return { fetchFood };
};