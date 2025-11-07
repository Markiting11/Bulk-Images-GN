export interface GenerateImageRequest {
  prompt: string;
  numberOfImages: number;
  referenceImage?: {
    base64: string;
    mimeType: string;
  } | null;
}