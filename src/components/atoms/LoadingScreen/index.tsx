// "use client";

// import { Assets } from "@/assets";
// import { useEffect, useState } from "react";
// import Image from "next/image";

// export const LoadingScreen = () => {
//   const [isVisible, setIsVisible] = useState(true);

//   const fetchData = async () => {
//     return new Promise<void>((resolve) => {
//       setTimeout(() => {
//         resolve();
//       }, 2000);
//     });
//   };

//   useEffect(() => {
//     const fetchLoading = async () => {
//       try {
//         await fetchData();
//         setIsVisible(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setIsVisible(false);
//       }
//     };

//     fetchLoading();
//   }, []);

//   return isVisible ? (
//     <div className="fixed left-0 top-0 z-[999999] h-screen w-full bg-black bg-opacity-90">
//       <div className="relative flex h-full w-full flex-col items-center justify-center">
//         <div className="animate-birdMove flex h-full w-full items-center justify-center ">
//           <Image
//             src={Assets.GifBird1}
//             alt="Loading..."
//             priority
//             width={400}
//             height={400}
//             style={{ width: "auto" }}
//           />
//         </div>
//       </div>
//     </div>
//   ) : null;
// };
