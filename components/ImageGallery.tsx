
import React from 'react';
import { ImageCard } from './ImageCard';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
      {images.map((base64Image, index) => (
        <ImageCard key={index} base64Image={base64Image} />
      ))}
    </div>
  );
};
