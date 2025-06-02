import React, { useState, useEffect, useRef } from "react";
import { StoryCard } from "./StoryCard";
import { StorySkeleton } from "./StorySkeleton";
import { CreateStoryModal } from "../models/CreateStoryModal";
import { useStories } from "../../hooks/useStories";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StoryType } from "./types";
import StoryView from "./StoryView";

export const StoryList: React.FC = () => {
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [filterBy, setFilterBy] = useState<"location" | "sport" | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [userPreferences, setUserPreferences] = useState<{
    preferredLocations: string[];
    preferredSports: string[];
  } | null>(null);

  const [openStory, setOpenStory] = useState<StoryType | null>(null);
  const [viewedStoryImages, setViewedStoryImages] = useState<{ [storyId: number]: number[] }>({});

  const navigate = useNavigate();
  const { loading, story } = useStories(filterBy);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  // Load viewedStoryImages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("viewedStoryImages");
    if (saved) {
      try {
        setViewedStoryImages(JSON.parse(saved));
      } catch {
        localStorage.removeItem("viewedStoryImages");
      }
    }
  }, []);

  const markImageAsViewed = (storyId: number, imageId: number) => {
    setViewedStoryImages((prev) => {
      const imagesForStory = prev[storyId] || [];
      if (!imagesForStory.includes(imageId)) {
        const updatedImages = [...imagesForStory, imageId];
        const updatedViewed = { ...prev, [storyId]: updatedImages };
        localStorage.setItem("viewedStoryImages", JSON.stringify(updatedViewed));
        return updatedViewed;
      }
      return prev;
    });
  };

  const isStoryFullyViewed = (story: StoryType) => {
    const viewedImagesForStory = viewedStoryImages[story.id] || [];
    return Array.isArray(story.Storyimages)
      ? story.Storyimages.every((img) => viewedImagesForStory.includes(img.id))
      : false;
  };

  const sortedStories = [...story].sort((a, b) => {
    const aViewed = isStoryFullyViewed(a);
    const bViewed = isStoryFullyViewed(b);
    return aViewed === bViewed ? 0 : aViewed ? 1 : -1;
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/settings/preferences`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserPreferences(response.data.preferences);
      } catch (err) {
        console.error("Failed to load preferences:", err);
      }
    };
    fetchPreferences();
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      if (scrollRef.current) {
        setScrollX(scrollRef.current.scrollLeft);
        setMaxScroll(scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
      }
    };
    updateScroll();
    const ref = scrollRef.current;
    if (ref) ref.addEventListener("scroll", updateScroll);
    return () => ref?.removeEventListener("scroll", updateScroll);
  }, [story]);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  const handleFilterChange = (newFilter: "location" | "sport" | null) => {
    if (newFilter === "location" && (!userPreferences?.preferredLocations?.length)) {
      setShowAlert(true);
      return;
    }
    if (newFilter === "sport" && (!userPreferences?.preferredSports?.length)) {
      setShowAlert(true);
      return;
    }
    setFilterBy(newFilter);
  };

  const openCreateStoryModal = () => setIsCreateStoryModalOpen(true);
  const closeCreateStoryModal = () => setIsCreateStoryModalOpen(false);
  const closeStoryView = () => setOpenStory(null);

  // Remove marking first image viewed here, mark viewed inside StoryView instead
  const handleOpenStory = (storyItem: StoryType) => {
    setOpenStory(storyItem);
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto w-screen pb-2 max-w-full hide-scrollbar">
        <StorySkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-2 relative">
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* Alert Modal */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Preferences Not Set</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {filterBy === "location"
                ? "Please set your preferred locations in settings to filter stories by location."
                : "Please set your preferred sports in settings to filter stories by sport."}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAlert(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => handleFilterChange("location")}
          className={`px-4 py-2 text-sm rounded-full transition ${
            filterBy === "location"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Location
        </button>
        <button
          onClick={() => handleFilterChange("sport")}
          className={`px-4 py-2 text-sm rounded-full transition ${
            filterBy === "sport"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Sport
        </button>
        {filterBy && (
          <button
            onClick={() => setFilterBy(null)}
            className="px-4 py-2 text-sm rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="relative w-full">
        {scrollX > 0 && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-1/2 -translate-y-2/3 z-10 bg-white dark:bg-slate-400 rounded-full p-2 shadow hide-scrollbar"
          >
            <ChevronLeft size={12} />
          </button>
        )}

        <div className="flex items-center overflow-hidden relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pl-4 pr-[52px]"
          >
            {/* Add Story */}
            <div
              className="flex flex-col items-center justify-center gap-1 cursor-pointer shrink-0"
              onClick={openCreateStoryModal}
            >
              <div className="p-[2px] rounded-full bg-gray-300 dark:bg-gray-300 relative">
                <div className="bg-white p-[2px] dark:bg-gray-200 rounded-full flex items-center justify-center w-14 h-14">
                  <span className="text-2xl font-bold text-gray-500">+</span>
                </div>
              </div>
              <span className="text-xs truncate w-16 text-center text-gray-400">Add Story</span>
            </div>

            <CreateStoryModal isOpen={isCreateStoryModalOpen} onClose={closeCreateStoryModal} />

            {/* Story Cards */}
            {sortedStories.length > 0 ? (
              sortedStories.map((storyItem) => (
                <StoryCard
                  key={storyItem.id}
                  story={storyItem}
                  filterBy={filterBy}
                  onOpen={() => handleOpenStory(storyItem)}
                  isViewed={isStoryFullyViewed(storyItem)}
                />
              ))
            ) : (
              <div className="flex items-center dark:text-slate-400 justify-center pb-4 w-full">
                <p>No Stories Found</p>
              </div>
            )}
          </div>
        </div>

        {scrollX < maxScroll && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-1/2 -translate-y-2/3 z-10 bg-white dark:bg-slate-400 rounded-full p-2 shadow"
          >
            <ChevronRight size={12} />
          </button>
        )}
      </div>

      {/* StoryView Overlay */}
      {openStory && (
        <StoryView
          story={openStory}
          onClose={closeStoryView}
          onImageViewed={(storyId: number, imageId: number) => {
            markImageAsViewed(storyId, imageId);
          }}
        />
      )}
    </div>
  );
};

export default StoryList;

// import React, { useState, useEffect, useRef } from "react";
// import { StoryCard } from "./StoryCard";
// import { StorySkeleton } from "./StorySkeleton";
// import { CreateStoryModal } from "../models/CreateStoryModal";
// import { useStories } from "../../hooks/useStories";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { BACKEND_URL } from "../../config";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { StoryType } from "./types";
// import StoryView from "./StoryView";

// export const StoryList: React.FC = () => {
//   const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
//   const [filterBy, setFilterBy] = useState<"location" | "sport" | null>(null);
//   const [showAlert, setShowAlert] = useState(false);
//   const [userPreferences, setUserPreferences] = useState<{
//     preferredLocations: string[];
//     preferredSports: string[];
//   } | null>(null);

//   const [openStory, setOpenStory] = useState<StoryType | null>(null);
//   // const [viewedStoryIds, setViewedStoryIds] = useState<number[]>([]);
//   const [viewedStoryImages, setViewedStoryImages] = useState<{ [storyId: number]: number[] }>({});


//   const navigate = useNavigate();
//   const { loading, story } = useStories(filterBy);
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [scrollX, setScrollX] = useState(0);
//   const [maxScroll, setMaxScroll] = useState(0);

//   // Load viewedStoryIds from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("viewedStoryImages");
//     if (saved) {
//       try {
//         setViewedStoryImages(JSON.parse(saved));
//       } catch {
//         localStorage.removeItem("viewedStoryImages");
//       }
//     }
//   }, []);


//   const markImageAsViewed = (storyId: number, imageId: number) => {
//     setViewedStoryImages((prev) => {
//       const imagesForStory = prev[storyId] || [];
//       if (!imagesForStory.includes(imageId)) {
//         const updatedImages = [...imagesForStory, imageId];
//         const updatedViewed = { ...prev, [storyId]: updatedImages };
//         localStorage.setItem("viewedStoryImages", JSON.stringify(updatedViewed));
//         return updatedViewed;
//       }
//       return prev;
//     });
//   };

//     const isStoryFullyViewed = (story: StoryType) => {
//       const viewedImagesForStory = viewedStoryImages[story.id] || [];
//       // Safely check if every imageId in story.Storyimages is included in viewedImagesForStory
//       // Assuming Storyimages is an array of image objects with an id property
//       return Array.isArray(story.Storyimages)
//         ? story.Storyimages.every((img) => viewedImagesForStory.includes(img.id))
//         : false;
//     };


//   const sortedStories = [...story].sort((a, b) => {
//     const aViewed = isStoryFullyViewed(a);
//     const bViewed = isStoryFullyViewed(b);
//     return aViewed === bViewed ? 0 : aViewed ? 1 : -1;
//   });

//   useEffect(() => {
//     const fetchPreferences = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       try {
//         const response = await axios.get(`${BACKEND_URL}/api/v1/settings/preferences`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUserPreferences(response.data.preferences);
//       } catch (err) {
//         console.error("Failed to load preferences:", err);
//       }
//     };
//     fetchPreferences();
//   }, []);

//   useEffect(() => {
//     const updateScroll = () => {
//       if (scrollRef.current) {
//         setScrollX(scrollRef.current.scrollLeft);
//         setMaxScroll(scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
//       }
//     };
//     updateScroll();
//     const ref = scrollRef.current;
//     if (ref) ref.addEventListener("scroll", updateScroll);
//     return () => ref?.removeEventListener("scroll", updateScroll);
//   }, [story]);

//   const handleScroll = (direction: "left" | "right") => {
//     const container = scrollRef.current;
//     if (!container) return;
//     container.scrollBy({
//       left: direction === "left" ? -200 : 200,
//       behavior: "smooth",
//     });
//   };

//   const handleFilterChange = (newFilter: "location" | "sport" | null) => {
//     if (newFilter === "location" && (!userPreferences?.preferredLocations?.length)) {
//       setShowAlert(true);
//       return;
//     }
//     if (newFilter === "sport" && (!userPreferences?.preferredSports?.length)) {
//       setShowAlert(true);
//       return;
//     }
//     setFilterBy(newFilter);
//   };

//   const openCreateStoryModal = () => setIsCreateStoryModalOpen(true);
//   const closeCreateStoryModal = () => setIsCreateStoryModalOpen(false);
//   const closeStoryView = () => setOpenStory(null);
//   const handleOpenStory = (storyItem: StoryType) => {
//     // if (storyItem.Storyimages && storyItem.Storyimages.length > 0) {
//     //   markImageAsViewed(storyItem.id, storyItem.Storyimages[0].id);
//     // }
//     setOpenStory(storyItem);
//   };

//   if (loading) {
//     return (
//       <div className="flex gap-4 overflow-x-auto w-screen pb-2 max-w-full hide-scrollbar">
//         <StorySkeleton />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col p-2 relative">
//       {showAlert && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           {/* Alert Modal */}
//           <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
//             <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Preferences Not Set</h2>
//             <p className="text-gray-600 dark:text-gray-300 mb-6">
//               {filterBy === "location"
//                 ? "Please set your preferred locations in settings to filter stories by location."
//                 : "Please set your preferred sports in settings to filter stories by sport."}
//             </p>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowAlert(false)}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => navigate("/settings")}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 Go to Settings
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filter Buttons */}
//       <div className="flex space-x-2 mb-4">
//         <button
//           onClick={() => handleFilterChange("location")}
//           className={`px-4 py-2 text-sm rounded-full transition ${
//             filterBy === "location"
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
//           }`}
//         >
//           Location
//         </button>
//         <button
//           onClick={() => handleFilterChange("sport")}
//           className={`px-4 py-2 text-sm rounded-full transition ${
//             filterBy === "sport"
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
//           }`}
//         >
//           Sport
//         </button>
//         {filterBy && (
//           <button
//             onClick={() => setFilterBy(null)}
//             className="px-4 py-2 text-sm rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
//           >
//             Clear Filter
//           </button>
//         )}
//       </div>

//       <div className="relative w-full">
//         {scrollX > 0 && (
//           <button
//             onClick={() => handleScroll("left")}
//             className="absolute left-0 top-1/2 -translate-y-2/3 z-10 bg-white dark:bg-slate-400 rounded-full p-2 shadow hide-scrollbar"
//           >
//             <ChevronLeft size={12} />
//           </button>
//         )}

//         <div className="flex items-center overflow-hidden relative">
//           <div
//             ref={scrollRef}
//             className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pl-4 pr-[52px]"
//           >
//             {/* Add Story */}
//             <div
//               className="flex flex-col items-center justify-center gap-1 cursor-pointer shrink-0"
//               onClick={openCreateStoryModal}
//             >
//               <div className="p-[2px] rounded-full bg-gray-300 dark:bg-gray-300 relative">
//                 <div className="bg-white p-[2px] dark:bg-gray-200 rounded-full flex items-center justify-center w-14 h-14">
//                   <span className="text-2xl font-bold text-gray-500">+</span>
//                 </div>
//               </div>
//               <span className="text-xs truncate w-16 text-center text-gray-400">Add Story</span>
//             </div>

//             <CreateStoryModal isOpen={isCreateStoryModalOpen} onClose={closeCreateStoryModal} />

//             {/* Story Cards */}
//             {sortedStories.length > 0 ? (
//               sortedStories.map((storyItem) => (


//                 <StoryCard
//                   key={storyItem.id}
//                   story={storyItem}
//                   filterBy={filterBy}
//                   onOpen={() => handleOpenStory(storyItem)}
//                   isViewed={isStoryFullyViewed(storyItem)}
//                 />
//               ))
//             ) : (
//               <div className="flex items-center dark:text-slate-400 justify-center pb-4 w-full">
//                 <p>No Stories Found</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {scrollX < maxScroll && (
//           <button
//             onClick={() => handleScroll("right")}
//             className="absolute right-0 top-1/2 -translate-y-2/3 z-10 bg-white dark:bg-slate-400 rounded-full p-2 shadow"
//           >
//             <ChevronRight size={12} />
//           </button>
//         )}
//       </div>

//       {/* StoryView Overlay */}
//       {openStory && <StoryView story={openStory} onClose={closeStoryView} />}
//     </div>
//   );
// };

// export default StoryList;

// // import React, { useState, useEffect, useRef } from "react";
// // import { StoryCard } from "./StoryCard";
// // // import { StoryView } from "./StoryView";
// // import { StorySkeleton } from "./StorySkeleton";
// // import { CreateStoryModal } from "../models/CreateStoryModal";
// // import { useStories } from "../../hooks/useStories";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { BACKEND_URL } from "../../config";
// // import { ChevronLeft, ChevronRight } from "lucide-react";
// // import { StoryType } from "./types";
// // import StoryView from "./StoryView";


// // export const StoryList: React.FC = () => {
// //   const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
// //   const [filterBy, setFilterBy] = useState<"location" | "sport" | null>(null);
// //   const [showAlert, setShowAlert] = useState(false);
// //   const [userPreferences, setUserPreferences] = useState<{
// //     preferredLocations: string[];
// //     preferredSports: string[];
// //   } | null>(null);

// //   const [openStory, setOpenStory] = useState<StoryType | null>(null);

// //   const navigate = useNavigate();
// //   const { loading, story } = useStories(filterBy);
// //   const scrollRef = useRef<HTMLDivElement>(null);
// //   const [scrollX, setScrollX] = useState(0);
// //   const [maxScroll, setMaxScroll] = useState(0);

// //   useEffect(() => {
// //     const fetchPreferences = async () => {
// //       const token = localStorage.getItem("token");
// //       if (!token) return;
// //       try {
// //         const response = await axios.get(`${BACKEND_URL}/api/v1/settings/preferences`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         setUserPreferences(response.data.preferences);
// //       } catch (err) {
// //         console.error("Failed to load preferences:", err);
// //       }
// //     };
// //     fetchPreferences();
// //   }, []);

// //   useEffect(() => {
// //     const updateScroll = () => {
// //       if (scrollRef.current) {
// //         setScrollX(scrollRef.current.scrollLeft);
// //         setMaxScroll(scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
// //       }
// //     };
// //     updateScroll();
// //     const ref = scrollRef.current;
// //     if (ref) {
// //       ref.addEventListener("scroll", updateScroll);
// //     }
// //     return () => {
// //       if (ref) {
// //         ref.removeEventListener("scroll", updateScroll);
// //       }
// //     };
// //   }, [story]);

// //   const handleScroll = (direction: "left" | "right") => {
// //     const container = scrollRef.current;
// //     if (!container) return;
// //     const scrollAmount = 200;
// //     container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
// //   };

// //   const handleFilterChange = (newFilter: "location" | "sport" | null) => {
// //     if (newFilter === "location" && (!userPreferences?.preferredLocations?.length)) {
// //       setShowAlert(true);
// //       return;
// //     }
// //     if (newFilter === "sport" && (!userPreferences?.preferredSports?.length)) {
// //       setShowAlert(true);
// //       return;
// //     }
// //     setFilterBy(newFilter);
// //   };

// //   const handleAlertConfirm = () => {
// //     setShowAlert(false);
// //     navigate("/settings");
// //   };

// //   const openCreateStoryModal = () => setIsCreateStoryModalOpen(true);
// //   const closeCreateStoryModal = () => setIsCreateStoryModalOpen(false);

// //   const closeStoryView = () => setOpenStory(null);

// //   if (loading) {
// //     return (
// //       <div className="flex gap-4 overflow-x-auto w-screen pb-2 max-w-full hide-scrollbar">
// //         <StorySkeleton />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex flex-col p-2 relative">
// //       {showAlert && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
// //           <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
// //             <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Preferences Not Set</h2>
// //             <p className="text-gray-600 dark:text-gray-300 mb-6">
// //               {filterBy === "location"
// //                 ? "Please set your preferred locations in settings to filter stories by location."
// //                 : "Please set your preferred sports in settings to filter stories by sport."}
// //             </p>
// //             <div className="flex justify-end gap-2">
// //               <button
// //                 onClick={() => setShowAlert(false)}
// //                 className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
// //               >
// //                 Cancel
// //               </button>
// //               <button onClick={handleAlertConfirm} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
// //                 Go to Settings
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <div className="flex space-x-2 mb-4">
// //         <button
// //           onClick={() => handleFilterChange("location")}
// //           className={`px-4 py-2 text-sm rounded-full transition ${
// //             filterBy === "location"
// //               ? "bg-blue-500 text-white"
// //               : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
// //           }`}
// //         >
// //           Location
// //         </button>
// //         <button
// //           onClick={() => handleFilterChange("sport")}
// //           className={`px-4 py-2 text-sm rounded-full transition ${
// //             filterBy === "sport"
// //               ? "bg-blue-500 text-white"
// //               : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
// //           }`}
// //         >
// //           Sport
// //         </button>
// //         {filterBy && (
// //           <button
// //             onClick={() => setFilterBy(null)}
// //             className="px-4 py-2 text-sm rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
// //           >
// //             Clear Filter
// //           </button>
// //         )}
// //       </div>

// //       <div className="relative w-full">
// //         {scrollX > 0 && (
// //           <button
// //             onClick={() => handleScroll("left")}
// //             className="absolute left-0 top-1/2 -translate-y-2/3 z-10 bg-white dark:bg-slate-400 rounded-full p-2 shadow"
// //           >
// //             <ChevronLeft size={12} />
// //           </button>
// //         )}

// //         <div className="flex items-center overflow-hidden relative">
// //           <div
// //             ref={scrollRef}
// //             className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pl-4 pr-[52px]"
// //             style={{ scrollbarWidth: "none" }}
// //           >
// //             <div
// //               className="flex flex-col items-center justify-center gap-1 cursor-pointer shrink-0"
// //               onClick={openCreateStoryModal}
// //             >
// //               <div className="p-[2px] rounded-full bg-gray-300 dark:bg-gray-300 relative">
// //                 <div className="bg-white p-[2px] dark:bg-gray-200 rounded-full flex items-center justify-center w-14 h-14">
// //                   <span className="text-2xl font-bold text-gray-500">+</span>
// //                 </div>
// //               </div>
// //               <span className="text-xs truncate w-16 text-center text-gray-400">Add Story</span>
// //             </div>

// //             <CreateStoryModal isOpen={isCreateStoryModalOpen} onClose={closeCreateStoryModal} />

// //             {story.length > 0 ? (
// //               story.map((storyItem) => (
// //                 <StoryCard
// //                   key={storyItem.id}
// //                   story={storyItem}
// //                   filterBy={filterBy}
// //                   onOpen={() => setOpenStory(storyItem)}
// //                 />
// //               ))
// //             ) : (
// //               <div className="flex items-center dark:text-slate-400 justify-center pb-4 w-full">
// //                 <p>No Stories Found</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {scrollX < maxScroll && (
// //           <button
// //             onClick={() => handleScroll("right")}
// //             className="absolute right-0 top-1/2 -translate-y-2/3 z-10 bg-white dark:bg-slate-400 rounded-full p-2 shadow"
// //           >
// //             <ChevronRight size={12} />
// //           </button>
// //         )}
// //       </div>

// //       {/* StoryView Overlay */}
// //       {openStory && <StoryView story={openStory} onClose={closeStoryView} />}
// //     </div>
// //   );
// // };

// // export default StoryList;
