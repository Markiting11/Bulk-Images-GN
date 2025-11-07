import React, { useState, useCallback } from 'react';
import type { GenerateImageRequest } from '../types';
import { XCircleIcon } from './icons/XCircleIcon';
import { Spinner } from './Spinner';

interface ControlPanelProps {
  onGenerate: (request: GenerateImageRequest) => void;
  isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('A majestic lion in a futuristic city, cinematic lighting, ultra-detailed.');
  const [numberOfImages, setNumberOfImages] = useState<number>(4);
  const [referenceImage, setReferenceImage] = useState<{ file: File; preview: string; } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage({
          file: file,
          preview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
    event.target.value = ''; // Allow re-uploading the same file
  };
  
  const removeReferenceImage = () => {
    setReferenceImage(null);
  };

  const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Strip the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve({ base64, mimeType: file.type });
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!prompt.trim() || isLoading) return;

    let imagePayload = null;
    if (referenceImage) {
        imagePayload = await fileToBase64(referenceImage.file);
    }

    onGenerate({
      prompt,
      numberOfImages,
      referenceImage: imagePayload,
    });
  }, [prompt, numberOfImages, referenceImage, isLoading, onGenerate]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Image Prompt
          </label>
          <textarea
            id="prompt"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-3 transition"
            placeholder="e.g., A photo of a cat wearing a wizard hat"
            required
          />
        </div>

        <div>
            <label htmlFor="reference-image" className="block text-sm font-medium text-gray-300 mb-2">
                Reference Image (Optional)
            </label>
            {referenceImage ? (
                <div className="relative group">
                    <img src={referenceImage.preview} alt="Reference preview" className="w-full h-auto rounded-md object-cover" />
                    <button 
                        type="button" 
                        onClick={removeReferenceImage} 
                        className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100"
                        aria-label="Remove reference image"
                    >
                        <XCircleIcon />
                    </button>
                </div>
            ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-indigo-500 px-2 py-1">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            )}
        </div>

        <div>
          <label htmlFor="numberOfImages" className="block text-sm font-medium text-gray-300 mb-2">
            Number of Images: <span className="font-bold text-indigo-400">{numberOfImages}</span>
          </label>
          <input
            id="numberOfImages"
            type="range"
            min="1"
            max="8"
            value={numberOfImages}
            onChange={(e) => setNumberOfImages(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
            style={{ '--thumb-color': '#818cf8' } as React.CSSProperties}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span className="ml-2">Generating...</span>
            </>
          ) : (
            'Generate Images'
          )}
        </button>
      </form>
      <style>{`
        .range-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: var(--thumb-color);
            border-radius: 50%;
            cursor: pointer;
        }
        .range-thumb::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: var(--thumb-color);
            border-radius: 50%;
            cursor: pointer;
        }
      `}</style>
    </div>
  );
};