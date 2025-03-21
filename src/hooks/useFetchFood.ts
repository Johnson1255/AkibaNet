// src/components/FoodPage/useFetchFood.ts

interface FoodData {
  [key: string]: Product[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export const useFetchFood = (setFoodData: React.Dispatch<React.SetStateAction<FoodData>>) => {
  const fetchFood = () => {
    fetch("http://localhost:3000/api/food")
      .then((res) => res.json())
      .then((data) => setFoodData(data))
      .catch((err) => console.error(err));
  };

  return { fetchFood };
};