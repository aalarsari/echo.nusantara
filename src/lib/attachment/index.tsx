import fs from "fs";
export function CreateLocationAttachment(location: number) {
   var directoryPath;
   if (location === 0) {
      directoryPath = "public/attachment/user/images";
   } else if (location === 1) {
      directoryPath = "public/attachment/product/images";
   } else if (location === 2) {
      directoryPath = "public/attachment/banner/images";
   } else if (location === 3) {
      directoryPath = "public/attachment/complaint/images";
   } else if (location === 4) {
      directoryPath = "public/attachment/bennefit/images";
   } else if (location === 5) {
      directoryPath = "public/attachment/social-media/images";
   } else if (location === 6) {
      directoryPath = "public/attachment/blog/images";
   } else if (location === 7) {
      directoryPath = "public/attachment/review/images";
   } else {
      directoryPath = "public/attachment/invoice";
   }

   if (!fs.existsSync(directoryPath)) {
      try {
         fs.mkdirSync(directoryPath.trim(), { recursive: true });
      } catch (error) {
         console.error("Error creating directory:", error);
      }
   }
   return directoryPath;
}
