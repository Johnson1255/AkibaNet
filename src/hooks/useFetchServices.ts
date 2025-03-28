import { useEffect } from "react";
import { ServicesByCategory } from "@/types/services";

export const useFetchServices = (
  setServicesByCategory: React.Dispatch<React.SetStateAction<ServicesByCategory>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const fetchUrl = `${import.meta.env.VITE_API_URL}/api/services/categories`;
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error('Error al obtener los servicios');
        }
        const categorized: ServicesByCategory = await response.json();
        setServicesByCategory(categorized);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching services:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [setServicesByCategory, setIsLoading, setError]);
};