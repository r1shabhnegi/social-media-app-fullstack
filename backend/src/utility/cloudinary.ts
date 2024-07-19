import cloudinary from "cloudinary";
import fs from "fs";
import { promisify } from "util";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const uploadOnCloudinary = async (localFilePath: string) => {
//   try {
//     console.log(localFilePath);
//     if (!localFilePath) return null;

//     const res = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     return res?.url;
//   } catch (error) {
//     console.log(error);
//     return null;
//   } finally {
//     fs.unlinkSync(localFilePath); // Remove the locally temp file as the upload got failed
//   }
// };

async function uploadOnCloudinary(imageFile: Express.Multer.File) {
  const b64 = Buffer.from(imageFile.buffer).toString("base64");
  let dataURI = "data:" + imageFile.mimetype + ";base64," + b64;
  const res = await cloudinary.v2.uploader.upload(dataURI);
  const imgUrl = res.url;
  return imgUrl;
}

export { uploadOnCloudinary };
