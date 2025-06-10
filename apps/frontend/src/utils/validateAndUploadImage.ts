import { classifyImage } from "./imageClassification";
import { uploadToCloudinary } from "./uploadToImageKit";

// import { uploadToImageKit} from "./uploadToImageKit";
// import { uploadToImageKitUnsigned } from "./uploadToImageKit"
// export const validateAndUploadImage = async (file: File, token: string): Promise<string> => {

export const validateAndUploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = async () => {
      try {
        const result = await classifyImage(img);

        if (!result.isSports) {
          reject(new Error("This image doesn't seem to be sports-related."));
          return;
        }

        // const uploadedUrl = await uploadToImageKit(file, token); // ← pass token
        // const uploadedUrl = await uploadToImageKitUnsigned(file);
        const uploadedUrl = await uploadToCloudinary(file);
        console.log("Cloudinary image URL:", uploadedUrl);
        resolve(uploadedUrl);
      } catch (err) {
        console.error(err);
        reject(new Error("Image validation or upload failed."));
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image."));
    };
  });
};
