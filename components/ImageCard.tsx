
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageCardProps {
  base64Image: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({ base64Image }) => {
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group relative aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-indigo-500/30 hover:scale-105">
      <img
        src={imageUrl}
        alt="Generated AI"
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-transform transform scale-90 group-hover:scale-100"
          aria-label="Download image"
        >
          <DownloadIcon />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};
