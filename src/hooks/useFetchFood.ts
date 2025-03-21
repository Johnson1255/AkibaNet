import { ProductData } from "@/types/product";

export const useFetchFood = (setFoodData: React.Dispatch<React.SetStateAction<ProductData>>) => {
  const fetchFood = () => {
    fetch("http://localhost:3000/api/food")
      .then((res) => res.json())
      .then((data) => setFoodData(data))
      .catch((err) => console.error(err));
  };

  return { fetchFood };
};