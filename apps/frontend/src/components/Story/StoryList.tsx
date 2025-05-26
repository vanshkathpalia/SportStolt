import { useState } from "react";
// import { usePosts } from "../../hooks";
import { StoryCard } from "./StoryCard";
import { StorySkeleton } from "./StorySkeleton";
import { CreateStoryModal } from "../models/CreateStoryModal";
import { useStories } from "../../hooks/useStories";

export const StoryList: React.FC = () => {
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [storyDisplayType, setStoryDisplayType] = useState<"location" | "sport" | "all">("all");

  const { loading, story } = useStories(storyDisplayType);

  const openCreateStoryModal = () => setIsCreateStoryModalOpen(true);
  const closeCreateStoryModal = () => setIsCreateStoryModalOpen(false);

  if (loading) {
    // Show 3 StorySkeletons like in PostList loading with multiple placeholders
    return (
      <div className="flex gap-4 overflow-x-auto w-screen pb-2 max-w-full">
        <StorySkeleton />
        {/* {Array(1)
          .fill(0)
          .map((_, index) => (
            <StorySkeleton key={index} />
        ))} */}
      </div>
    );
  }

//   if (story.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
//         <p>No stories available</p>
//         <button
//           onClick={openCreateStoryModal}
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Add Story
//         </button>
//         <CreateStoryModal isOpen={isCreateStoryModalOpen} onClose={closeCreateStoryModal} />
//       </div>
//     );
//   }

  return (
    <div className="flex flex-col p-2">
        <div className="flex space-x-2">
            <button
                onClick={() => setStoryDisplayType("location")}
                className={`px-3 py-1 text-sm rounded-full transition ${
                storyDisplayType === "location"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
            >
                Locations
            </button>
            <button
                onClick={() => setStoryDisplayType("sport")}
                className={`px-3 py-1 text-sm rounded-full transition ${
                storyDisplayType === "sport"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
            >
                Sports
            </button>
            {/* <Button
                onClick={openCreateModal}
                size="sm"
                className="hidden md:flex items-center gap-1 bg-blue-500 text-white hover:bg-blue-600"
            >
                <PlusCircle className="h-4 w-4" />
                Create Post
            </Button> */}
        </div>
        <div className="bg-background gap-4 mt-2 flex justify-center">
            <div className="pt-2 scroll-pr-24 gap-4 overflow-x-auto w-screen pb-2 max-w-full flex flex-row">
            {/* Add Story Button */}
            <div
                className="flex flex-col items-center justify-center gap-1 cursor-pointer"
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

            {/* Render stories */}
            {story.length > 0 ? (
                story.map((story) => {
                    return (
                        <StoryCard
                            key={story.id}
                            story={{
                                id: story.id,
                                locationImage: story.locationImage,
                                location: story.location,
                                description: story.description,
                                participants: story.participants,
                                createdAt: story.createdAt,
                                image: story.locationImage,
                                activityEnded: story.activityEnded,
                                activityStarted: story.activityStarted,
                                sport: story.sport,
                                endTime: story.endTime,
                                author: story.author,
                                Storyimages: story.Storyimages,
                                isViewed: story.isViewed,
                                swipeUpEnabled: story.swipeUpEnabled,
                                authenticityStatus: story.authenticityStatus,
                            }}
                            onClose={() => console.log('Story card closed')} // Add this line
                        />
                    );
                })
                ) : (
                    <div className="flex items-center dark:text-slate-400 justify-center pb-4">
                        <p>
                            No stories available
                        </p>
                    </div>
                )}
            
            </div>
        </div>
    </div>
  );
};