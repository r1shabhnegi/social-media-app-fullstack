import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadMultiImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export async function uploadSingleImage(image: Express.Multer.File) {
  const b64 = Buffer.from(image.buffer).toString("base64");
  let dataURI = "data:" + image.mimetype + ";base64," + b64;

  const res = await cloudinary.uploader.upload(dataURI);

  const imageUrl = res.url;

  return imageUrl;
}

export async function deleteMultiImages(imageUrl: string) {
  try {
    const result = await cloudinary.uploader.destroy(imageUrl);
    return result;
  } catch (error) {
    console.log("Error deleting images");
  }
}

export async function deleteSingleImage(imageUrl: string) {
  try {
    const result = await cloudinary.uploader.destroy(imageUrl);
    return result;
  } catch (error) {
    console.log("Error deleting image");
  }
}
