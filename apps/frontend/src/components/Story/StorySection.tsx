// import { useState } from "react";
// // import { StoryList } from "./Storylist";
// import { Button } from "../ui/button";
// import { PlusCircle } from "lucide-react";
// import { StoryList } from "./Storylist";

// // interface StorySectionProps {
// //   // openCreateModal: () => void
// //   storyDisplayType: "location" | "sport"
// // }
// interface StorySectionProps {
//   storyDisplayType: "location" | "sport"
// }

// export const StorySection = ({ storyDisplayType }: StorySectionProps) => {
//   // const [storyDisplayType, setStoryDisplayType] = useState<"location" | "sport">("location");

//   return (
//     // <div className="mt-2 md:mt-4">
//     //   <div className="flex justify-between items-center">
//     //     <div className="flex space-x-2">
//     //       <button
//     //         onClick={() => setStoryDisplayType("location")}
//     //         className={`px-3 py-1 text-sm rounded-full transition ${
//     //           storyDisplayType === "location"
//     //             ? "bg-blue-500 text-white"
//     //             : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
//     //         }`}
//     //       >
//     //         Locations
//     //       </button>
//     //       <button
//     //         onClick={() => setStoryDisplayType("sport")}
//     //         className={`px-3 py-1 text-sm rounded-full transition ${
//     //           storyDisplayType === "sport"
//     //             ? "bg-blue-500 text-white"
//     //             : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
//     //         }`}
//     //       >
//     //         Sports
//     //       </button>
//     //     </div>
//     //     <Button
//     //       onClick={openCreateModal}
//     //       size="sm"
//     //       className="hidden md:flex items-center gap-1 bg-blue-500 text-white hover:bg-blue-600"
//     //     >
//     //       <PlusCircle className="h-4 w-4" />
//     //       Create Post
//     //     </Button>
//     //   </div>

//       <div className="pt-2">
//         <StoryList displayType={storyDisplayType} />
//         {/* <StoryList displayType={storyDisplayType} /> */}
//       </div>
      
//     </div>
//   );
// };
