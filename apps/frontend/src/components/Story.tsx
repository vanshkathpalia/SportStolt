// design for the story, using story card
//add a logic, where if any story is on the other side, > will appear 

import { usePosts } from "../hooks";
import { StoryCard } from "./StoryCard";
import { StorySkeleton } from "./StorySkeleton";

export const Story = () => {
    const { loading, story } = usePosts();
    const reversedStories = [...story].reverse();

    if (loading) {
        return <div >
            <StorySkeleton />
        </div>
    }

    else {
        return <div>
            <div className="bg-white gap-4 rounded-lg shadow-sm p-2 mb-4">
                <div className="p-2 scroll-pr-24 flex gap-4 overflow-x-auto w-screen pb-2 max-w-3xl" >
                    {reversedStories.map(story => <StoryCard
                        id={story.id}
                        authorName={story.author.name || "Anonymous"}
                        isViewed={story.isViewed}
                        image={story.image}
                        location={story.location}
                        createdAt={"date"} />)}
                </div>
            </div>
        </div>
    }
}


// flex flex-row-reverse gap-1 overflow-x-auto pb-2 scrollbar-hide cursor-pointer

// //design for the story, using story card

// import { useEffect, useRef, useState } from "react";
// import { ChevronLeft, ChevronRight } from 'lucide-react'
// import { usePosts } from "../hooks";
// import { Spinner } from "./Spinner";
// import { StoryCard } from "./StoryCard";

// // export const Story = () => {
//     // const { loading, story } = usePosts();

//     // if (loading) {
//     //     return <div>
//     //         <Spinner />
//     //     </div>
//     // }

//     // else {
// //         return <div>
// //             <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
// //                 <div className="flex flex-row-reverse gap-4 overflow-x-auto pb-2 scrollbar-hidecursor-pointer" >
// //                 {story.map(story => <StoryCard
// //                     id={story.id}
// //                     authorName={story.author.name || "Anonymous"}
// //                     isViewed={story.isViewed}
// //                     image={story.image}
// //                     location={story.location}
// //                     createdAt={"date"} />)}
// //                 </div>
// //             </div>
// //         </div>
// //     }
// // }



// export const Story = () => {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(true);

//   const checkScroll = () => {
//     if (!scrollRef.current) return;
    
//     const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
//     setShowLeftArrow(scrollLeft > 0);
//     setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
//   };

//   useEffect(() => {
//     const scrollElement = scrollRef.current;
//     if (scrollElement) {
//       scrollElement.addEventListener('scroll', checkScroll);
//       // Initial check
//       checkScroll();
      
//       return () => scrollElement.removeEventListener('scroll', checkScroll);
//     }
//   }, []);

//   const scroll = (direction: 'left' | 'right') => {
//     if (!scrollRef.current) return;
    
//     const scrollAmount = 300; // Adjust this value to control scroll distance
//     const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
//     scrollRef.current.scrollTo({
//       left: newScrollLeft,
//       behavior: 'smooth'
//     });
//   };
  
//   const { loading, story } = usePosts();

//   if (loading) {
//       return <div>
//           <Spinner />
//       </div>
//   }

//   else {
//     return (
//         <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 relative">
//         {/* Left Arrow */}
//         {showLeftArrow && (
//             <button
//             onClick={() => scroll('left')}
//             className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1.5 shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors"
//             aria-label="Scroll left"
//             >
//             <ChevronLeft className="w-5 h-5 text-gray-600" />
//             </button>
//         )}

//         {/* Right Arrow */}
//         {showRightArrow && (
//             <button
//             onClick={() => scroll('right')}
//             className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1.5 shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors"
//             aria-label="Scroll right"
//             >
//             <ChevronRight className="w-5 h-5 text-gray-600" />
//             </button>
//         )}

//         {/* Stories Container */}
//         <div 
//             ref={scrollRef}
//             className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide relative scroll-smooth"
//         >
//             {/* {stories.map((story, index) => (
//             <StoryCircle
//                 key={index}
//                 username={story.username}
//                 imageUrl={story.imageUrl}
//                 isAdd={story.isAdd}
//                 hasStory={story.hasStory !== false}
//                 viewed={story.viewed}
//             />
//             ))} */}
//             {story.map(story => <StoryCard
//                         id={story.id}
//                         authorName={story.author.name || "Anonymous"}
//                         isViewed={story.isViewed}
//                         image={story.image}
//                         location={story.location}
//                         createdAt={"date"} />)}
//         </div>
//     </div>
//     )}
// }

