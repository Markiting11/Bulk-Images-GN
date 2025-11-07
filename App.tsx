import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { ImageGallery } from './components/ImageGallery';
import { Spinner } from './components/Spinner';
import { generateImagesFromApi } from './services/geminiService';
import type { GenerateImageRequest } from './types';

function App() {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (request: GenerateImageRequest) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    try {
      const images = await generateImagesFromApi(request);
      setGeneratedImages(images);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Generation failed:', errorMessage);
      setError(`Failed to generate images. Please try again. Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Bulk AI Image Generator
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 xl:w-1/4 lg:sticky lg:top-24 self-start">
            <ControlPanel onGenerate={handleGenerate} isLoading={isLoading} />
          </div>

          <div className="lg:w-2/3 xl:w-3/4">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-96 bg-gray-800/50 rounded-lg">
                <Spinner />
                <p className="mt-4 text-lg text-gray-400">Generating your images... this may take a moment.</p>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-96 bg-red-900/20 border border-red-500 rounded-lg p-4">
                <p className="text-center text-red-300">{error}</p>
              </div>
            )}
            
            {!isLoading && !error && generatedImages.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-4 text-lg text-gray-500">Your generated images will appear here.</p>
                    <p className="text-sm text-gray-600">Fill out the details on the left and click "Generate".</p>
                </div>
            )}

            {!isLoading && generatedImages.length > 0 && (
              <ImageGallery images={generatedImages} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;