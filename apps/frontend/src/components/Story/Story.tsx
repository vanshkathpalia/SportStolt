
import { usePosts } from "../../hooks";
import StoryCard from "./StoryCard";
import { StorySkeleton } from "./StorySkeleton";
import { CreateStoryModal } from "../models/CreateStoryModal";
import { useState } from "react";

export const Story = () => {
    const { loading, story } = usePosts();

    const reversedStories = [...story].reverse();

    const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);

    const openCreateStoryModal = () => {
        setIsCreateStoryModalOpen(true);
      };
    
      // Function to close the modal
      const closeCreateStoryModal = () => {
        setIsCreateStoryModalOpen(false);
      };
    // const handleStoryClick = (story: Story) => {
    //     if (story.isYourStory) {
    //       openCreateStoryModal()
    //     } 
        // else {
        //   setSelectedStory(story)
        //   setStoryModalOpen(true)
        // }

    if (loading) {
        return <div><StorySkeleton /></div>;
    }

    return (
        <div className="flex flex-col">
            <div className="bg-white gap-4 flex justify-center">
                <div className="pt-2 scroll-pr-24 gap-4 overflow-x-auto w-screen pb-2 max-24 flex flex-row">

                    {/* ✅ Add Story Button (Visible Always) */}
                    <div 
                        className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                        onClick={openCreateStoryModal}
                    >
                        <div className="p-[2px] rounded-full bg-gray-300 relative">
                            <div className="bg-white p-[2px] rounded-full flex items-center justify-center w-14 h-14">
                                <span className="text-2xl font-bold text-gray-500">+</span>
                            </div>
                        </div>
                        <span className="text-xs truncate w-16 text-center text-gray-500">Add Story</span>
                    </div>

                    <CreateStoryModal
                        isOpen={isCreateStoryModalOpen}
                        onClose={closeCreateStoryModal}
                    />

                    {/* ✅ Show Stories if Available */}
                    {reversedStories.length > 0 ? (
                        reversedStories.map((story) => {
                            return (
                                <StoryCard
                                    key={story.id}
                                    story={{
                                        id: story.id,
                                        locationImage: story.locationImage,
                                        location: story.location,
                                        description: story.description,
                                        eventLink: story.eventLink,
                                        createdAt: story.createdAt,
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
                        <div className="flex items-center justify-center pb-4">
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




// // design for the story, using story card
// //add a logic, where if any story is on the other side, > will appear 

// // import { usePosts } from "../../hooks";
// // import { StoryCard } from "./StoryCard";
// // import { StorySkeleton } from "./StorySkeleton";

// // export const Story = () => {
// //     const { loading, story } = usePosts();
// //     const reversedStories = [...story].reverse();

// //     if (loading) {
// //         return <div >
// //             <StorySkeleton />
// //         </div>
// //     }

//     // else {
//         // <div className="flex flex-col p-4">
//         //         <div className="flex justify-center">
//         //             <div className="bg-white border border-gray-100 rounded-lg mb-4 flex flex-col justify-center"></div>
//         // return <div className="flex flex-col p-4">
//         //     <div className="bg-white gap-4 rounded-lg shadow-md p-2 flex justify-center">
//         //         <div className="p-2 scroll-pr-24 gap-4 overflow-x-auto w-screen pb-2 max-24 flex flex-row" >
//         //             {reversedStories.map(story => <StoryCard
//         //                 story={story}
//         //                 author={{ name: story.author.name || "Anonymous" }}
//         //                 // , image: story.author.image
//         //                 // description={story.description}
//         //                 // eventLink={story.eventLink}
//         //                 // sport={story.sport}
//         //                 // stadium={story.stadium}
//         //                 // swipeUpEnabled={story.swipeUpEnabled}
//         //                 // authenticityStatus={story.authenticityStatus}
//         //                 authorName={story.author.name || "Anonymous"}
//         //                 // isViewed={story.isViewed}
//         //                 locationImage={story.locationImage}
//         //                 location={story.location}
//         //                 // createdAt={story.createdAt} 
//         //                 />)}
//         //         </div>
//         //     </div>
//         // </div>
//     // }
// // }


// // flex flex-row-reverse gap-1 overflow-x-auto pb-2 scrollbar-hide cursor-pointer

// // //design for the story, using story card

// // import { useEffect, useRef, useState } from "react";
// // import { ChevronLeft, ChevronRight } from 'lucide-react'
// // import { usePosts } from "../hooks";
// // import { Spinner } from "./Spinner";
// // import { StoryCard } from "./StoryCard";

// // // export const Story = () => {
// //     // const { loading, story } = usePosts();

// //     // if (loading) {
// //     //     return <div>
// //     //         <Spinner />
// //     //     </div>
// //     // }

// //     // else {
// // //         return <div>
// // //             <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
// // //                 <div className="flex flex-row-reverse gap-4 overflow-x-auto pb-2 scrollbar-hidecursor-pointer" >
// // //                 {story.map(story => <StoryCard
// // //                     story={story}
// // //                     authorName={story.author.name || "Anonymous"}
// // //                     isViewed={story.isViewed}
// // //                     image={story.image}
// // //                     location={story.location}
// // //                     createdAt={"date"} />)}
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     }
// // // }



// // export const Story = () => {
// //   const scrollRef = useRef<HTMLDivElement>(null);
// //   const [showLeftArrow, setShowLeftArrow] = useState(false);
// //   const [showRightArrow, setShowRightArrow] = useState(true);

// //   const checkScroll = () => {
// //     if (!scrollRef.current) return;
    
// //     const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
// //     setShowLeftArrow(scrollLeft > 0);
// //     setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
// //   };

// //   useEffect(() => {
// //     const scrollElement = scrollRef.current;
// //     if (scrollElement) {
// //       scrollElement.addEventListener('scroll', checkScroll);
// //       // Initial check
// //       checkScroll();
      
// //       return () => scrollElement.removeEventListener('scroll', checkScroll);
// //     }
// //   }, []);

// //   const scroll = (direction: 'left' | 'right') => {
// //     if (!scrollRef.current) return;
    
// //     const scrollAmount = 300; // Adjust this value to control scroll distance
// //     const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
// //     scrollRef.current.scrollTo({
// //       left: newScrollLeft,
// //       behavior: 'smooth'
// //     });
// //   };
  
// //   const { loading, story } = usePosts();

// //   if (loading) {
// //       return <div>
// //           <Spinner />
// //       </div>
// //   }

// //   else {
// //     return (
// //         <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 relative">
// //         {/* Left Arrow */}
// //         {showLeftArrow && (
// //             <button
// //             onClick={() => scroll('left')}
// //             className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1.5 shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors"
// //             aria-label="Scroll left"
// //             >
// //             <ChevronLeft className="w-5 h-5 text-gray-600" />
// //             </button>
// //         )}

// //         {/* Right Arrow */}
// //         {showRightArrow && (
// //             <button
// //             onClick={() => scroll('right')}
// //             className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1.5 shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors"
// //             aria-label="Scroll right"
// //             >
// //             <ChevronRight className="w-5 h-5 text-gray-600" />
// //             </button>
// //         )}

// //         {/* Stories Container */}
// //         <div 
// //             ref={scrollRef}
// //             className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide relative scroll-smooth"
// //         >
// //             {/* {stories.map((story, index) => (
// //             <StoryCircle
// //                 key={index}
// //                 username={story.username}
// //                 imageUrl={story.imageUrl}
// //                 isAdd={story.isAdd}
// //                 hasStory={story.hasStory !== false}
// //                 viewed={story.viewed}
// //             />
// //             ))} */}
// //             {story && story.map(story => <StoryCard
// //                         story={{
// //                             id: story.id,
// //                             locationImage: story.locationImage,
// //                             location: story.location,
// //                             description: story.description,
// //                             eventLink: story.eventLink,
// //                             createdAt: story.createdAt,
// //                             sport: story.sport,
// //                             endTime: story.endTime,
// //                             author: story.author,
// //                             Storyimages: story.Storyimages,
// //                             isViewed: story.isViewed,
// //                             swipeUpEnabled: story.swipeUpEnabled,
// //                             authenticityStatus: story.authenticityStatus,
// //                             authorName: story.author?.name || "Anonymous",
// //                             UserID: story.UserID?.toString() ?? ""
// //                         }}
// //                         onClose={() => {
// //                             // Implement the logic for closing the story view
// //                             console.log('Story closed');
// //                         }}
// //                     />
// //                 )}
// //         </div>
// //     </div>
// //     )}
// // }


// {/* <div className="bg-white gap-4 rounded-lg shadow-md p-2 flex justify-center">
//                  <div className="p-2 scroll-pr-24 gap-4 overflow-x-auto w-screen pb-2 max-24 flex flex-row" >
//                      <Mock/>
//                  </div>
//             </div> */}