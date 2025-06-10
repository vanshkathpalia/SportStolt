import { BACKEND_URL } from "../config";

// uploadToCloudinary.ts
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "SportStolt-unsigned"); // your unsigned preset name
  formData.append("folder", "sportstolt_uploads"); // optional
  formData.append("cloud_name", "dfvvor7fe"); // not required for API call, for reference

  const response = await fetch("https://api.cloudinary.com/v1_1/dfvvor7fe/image/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!data || !data.secure_url) {
    console.error(data);
    throw new Error("Cloudinary upload failed");
  }

  return data.secure_url;
};


export const uploadToImageKit = async (file: File, userToken: string): Promise<string> => {
  const res = await fetch(`${BACKEND_URL}/api/v1/post/upload-auth`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  if (!res.ok) throw new Error("Failed to get upload signature");

  const { signature, token, expire, publicKey } = await res.json();

  console.log(signature, token, expire, publicKey);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("signature", signature);
  formData.append("token", token);
  formData.append("expire", expire);
  formData.append("publicKey", publicKey); 

  const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: formData,
  });

   const data = await uploadRes.json();

  // Check for success or specific ImageKit errors
  if (uploadRes.ok && data && data.url) { // Check uploadRes.ok as well
    return data.url;
  } else {
    // ImageKit often returns an 'message' field on error
    const errorMessage = data.message || "ImageKit upload failed: Unknown error.";
    console.error("ImageKit Upload Error:", data); // Log the full response for debugging
    throw new Error(errorMessage);
  }

  return data.url;
};

export const uploadToImageKitUnsigned = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", "public_cu3MRo86rd2dKqqfS6ypr4mWdEk="); // Your public key

  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.url) {
    console.error("Upload error in unsigned:", data);
    throw new Error("ImageKit upload failed");
  }
  return data.url;
};