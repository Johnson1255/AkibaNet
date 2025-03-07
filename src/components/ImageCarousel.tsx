import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImageCarouselProps {
  images: string[];
  alt?: string;
}

export default function ImageCarousel({ images, alt = "Room image" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Si no hay imágenes, mostrar un placeholder
  if (!images.length) {
    return (
      <Card className="bg-gray-100 p-8 flex items-center justify-center rounded-2xl min-h-48">
        <p className="text-gray-500">No image available</p>
      </Card>
    );
  }

  // Preparar la URL de la imagen (suponiendo que las imágenes están en una carpeta /images)
  const imageUrl = `/images/${images[currentIndex]}`;

  return (
    <Card className="bg-gray-100 rounded-2xl relative overflow-hidden min-h-48">
      <div className="w-full h-full">
        <img
          src={imageUrl}
          alt={`${alt} ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Si hay error al cargar la imagen, mostrar un fallback
            (e.target as HTMLImageElement).src = "https://placehold.co/600x400.png";
          }}
        />
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/70 hover:bg-white"
            onClick={prevImage}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/70 hover:bg-white"
            onClick={nextImage}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
