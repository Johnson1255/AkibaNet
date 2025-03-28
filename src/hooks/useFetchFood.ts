import { ProductData } from "@/types/product";

export const useFetchFood = (setFoodData: React.Dispatch<React.SetStateAction<ProductData>>) => {
  const fetchFood = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/food`)
      .then((res) => res.json())
      .then((data) => setFoodData(data))
      .catch((err) => console.error(err));
  };

  return { fetchFood };
};