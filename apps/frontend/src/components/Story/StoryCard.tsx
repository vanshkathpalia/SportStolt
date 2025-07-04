// import React, { useEffect, useState } from "react";
import { StoryType } from "./types";

interface StoryCardProps {
  story: StoryType;
  filterBy?: "location" | "sport" | null;
  onOpen: () => void;
  isViewed: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, filterBy, onOpen, isViewed }) => {
  // State to track if the story is viewed
  // const [isViewed, setIsViewed] = useState(false);

  // useEffect(() => {
  //   // Get viewed stories from localStorage
  //   const viewedStoriesRaw = localStorage.getItem("viewedStories");
  //   const viewedStories: number[] = viewedStoriesRaw ? JSON.parse(viewedStoriesRaw) : [];

  //   // Assuming story.id is unique identifier for the story
  //   setIsViewed(viewedStories.includes(story.id));
  // }, [story.id]);

  // Filter logic — only show card if matches filter
  if (filterBy === "location" && !story.location) return null;
  if (filterBy === "sport" && !story.sport) return null;

  const label = 
    filterBy === 'location'
      ? story.stadium
      : filterBy === 'sport'
      ? story.stadium || 'Unknown Sport'
      : new Date(story.activityStarted).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Color ring class based on viewed or not
  const ringColorClass = isViewed
    ? "from-gray-400 to-gray-600"    // Viewed stories get a gray ring
    : "from-pink-500 to-yellow-500"; // Unviewed stories get the pink-yellow gradient ring

  return (
    <div
      className="flex flex-col items-center cursor-pointer shrink-0"
      onClick={onOpen}
      aria-label={`Open story from ${story.location || story.sport}`}
    >
      <div className={`rounded-full p-[3px] bg-gradient-to-tr ${ringColorClass}`}>
        <img
          src={story.locationImage}
          alt={story.location || story.sport || "story"}
          className="w-14 h-14 rounded-full object-cover"
        />
      </div>
      <span className="text-xs w-16 text-center truncate text-gray-400">
        {label}
      </span>
    </div>
  );
};

export default StoryCard;

// import React from "react";
// import { StoryType } from "./types";

// interface StoryCardProps {
//   story: StoryType;
//   filterBy?: "location" | "sport" | null;
//   onOpen: () => void;
// }

// export const StoryCard: React.FC<StoryCardProps> = ({ story, filterBy, onOpen }) => {
//   // Filter logic — only show card if matches filter
//   if (filterBy === "location" && !story.location) return null;
//   if (filterBy === "sport" && !story.sport) return null;

//   const label = 
//   filterBy === 'location'
//     ? story.stadium
//     : filterBy === 'sport'
//     ? story.stadium || 'Unknown Sport'
//     : new Date(story.activityStarted).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   // let label;
//   //   if (filterBy === "location") {
//   //     label = story.location;
//   //   } else if (filterBy === "sport") {
//   //     label = story.sport;
//   //   } else {
//   //     label = story.activityStarted.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   //   }


//   return (
//     <div
//       className="flex flex-col items-center cursor-pointer shrink-0"
//       onClick={onOpen}
//       aria-label={`Open story from ${story.location || story.sport}`}
//     >
//      <div
//         className={`rounded-full p-[3px] ${
//           story.seen
//             ? "bg-gray-300" // Seen: gray ring
//             : "bg-gradient-to-tr from-pink-500 to-yellow-500" // Unseen: gradient
//         }`}
//       >
//         <img
//           src={story.locationImage}
//           alt={story.location || story.sport || "story"}
//           className="w-14 h-14 rounded-full object-cover"
//         />
//       </div>
//       <span className="text-xs w-16 text-center truncate text-gray-400">
//         {label}
//       </span>
//     </div>
//   );
// };

// export default StoryCard;


// import { useState } from 'react';
// import { StoryView } from './StoryView';
// import { BACKEND_URL } from '../../config';

// export interface StoryType {
//   id: number;
//   locationImage: string;
//   // image: string;
//   location: string;
//   description?: string;
//   activityStarted: Date;
//   activityEnded: Date;
//   participants?: number;
//   createdAt: string;
//   sport?: string;
//   endTime: Date;
//   author: {
//     username: string;
//     image?: string;
//     userId: string;
//   };
//   Storyimages?: {
//     id: number;
//     url?: string;
//     userId: string;
//   }[];
//   swipeUpEnabled?: boolean;
//   authenticityStatus?: string;
//   stadium: string;
//   isViewed: boolean;
// }

// interface StoryCardProps {
//   story: StoryType;
//   isViewed?: boolean;
//   onClose: () => void;
//   filterBy?: 'location' | 'sport' | null;
// }

// export const StoryCard: React.FC<StoryCardProps> = ({ story, filterBy }) => {
//   const [isViewedingStory, setisViewedingStory] = useState(false);
//   const [isViewed, setisViewed] = useState(story.isViewed || false);

//   const handleOpenStory = async () => {
//     setisViewedingStory(true);
//     setisViewed(true);

//     const token = localStorage.getItem('token');
//     try {
//       await fetch(`${BACKEND_URL}/api/v1/story/view`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: token ?? '',
//         },
//         body: JSON.stringify({ storyId: story.id }),
//       });
//     } catch (error) {
//       console.error('Error updating story view status:', error);
//     }
//   };

//   if (!story) return null;

//   const images = Array.isArray(story.Storyimages)
//     ? story.Storyimages.map((image) => ({
//         id: image?.id,
//         url: image?.url,
//         userId: image?.userId?.toString(),
//       }))
//     : [];

//   if (images.length === 0) {
//     return <div>No images available.</div>;
//   }

//   console.log('filterBy', filterBy);  
//   console.log('story', story.stadium);  
//   // Determine the label to display based on the filter
//   const label =
//   filterBy === 'location'
//     ? story.stadium
//     : filterBy === 'sport'
//     ? story.stadium || 'Unknown Sport'
//     : new Date(story.activityStarted).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   const imageURL =
//   filterBy === 'location'
//     ? story.locationImage
//     : filterBy === 'sport'
//     ? story.Storyimages?.[story.Storyimages.length - 1]?.url || ''
//     : story.locationImage;
//   // let label: string;
//   // if (filterBy === 'location') {
//   //   label = story.location;
//   // } else if (filterBy === 'sport') {
//   //   label = story.sport || 'Unknown Sport';
//   // } else {
//   //   const date = new Date(story.activityStarted);
//   //   label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   // }
// //   let displayLabel: string;
// //   if (filterBy === 'location') {
// //     displayLabel = story.location;
// //   } else if (filterBy === 'sport') {
// //     displayLabel = story.sport || '';
// //   } else {
// //     // Format activityStarted time
// //     const activityDate = new Date(story.activityStarted);
// //     displayLabel = activityDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //   }

//   return (
//     <>
//       <div
//         className="flex flex-col items-center hover:bg-muted justify-center gap-1 cursor-pointer"
//         onClick={handleOpenStory}
//       >
//         <div
//           className={`p-[2px] rounded-full ${
//             isViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 to-pink-600'
//           }`}
//         >
//           <div className="bg-white dark:bg-gray-800 p-[2px] rounded-full">
//             <img
//               src={imageURL}
//               alt={story.location}
//               className="w-14 h-14 rounded-full object-cover"
//             />
//           </div>
//         </div>
//         <span className="text-xs truncate w-16 dark:text-slate-300 text-center">
//           {label}
//         </span>
//       </div>

//       {isViewedingStory && (
//         <StoryView
//           // story={{
//           //   id: story.id,
//           //   locationImage: story.locationImage,
//           //   // image: story.locationImage,
//           //   location: story.location,
//           //   description: story.description,
//           //   participants: story.participants,
//           //   createdAt: story.createdAt,
//           //   sport: story.sport,
//           //   activityEnded: story.activityEnded,
//           //   activityStarted: story.activityStarted,
//           //   endTime: story.endTime,
//           //   authenticityStatus: story.authenticityStatus,
//           //   stadium: story.stadium,
//           //   swipeUpEnabled: story.swipeUpEnabled,
//           //   Storyimages: images,
//           //   author: {
//           //     username: story.author?.username || 'hello',
//           //     image: story.author?.image,
//           //     userId: story.author?.userId || '',
//           //   },
//           //   isViewed: isViewed,
//           // }}
//           story={story}
//           onClose={() => setisViewedingStory(false)}
//           // isVieded={isViewed}
//         />
//       )}
//     </>
//   );
// };

// export default StoryCard;


// // // // this is each story circle that will be shown in the home page

// // // import { useState } from 'react';
// // // import { StoryView } from './StoryView';
// // // // import { useNavigate } from 'react-router-dom';
// // // import { BACKEND_URL } from '../../config';


// // // export interface StoryType {
// // //     id: number;
// // //     locationImage: string;
// // //     image: string;
// // //     location: string;
// // //     description?: string;
// // //     activityStarted: Date;
// // //     activityEnded: Date;
// // //     participants?: number;
// // //     createdAt: string;
// // //     sport?: string;
// // //     endTime: Date; //HERE was any
// // //     author: {
// // //         username: string;
// // //         image?: string;
// // //         userId: string;
// // //     };
// // //     Storyimages: {
// // //         id: number;
// // //         url?: string;
// // //         userId: string;
// // //     }[];
// // //     swipeUpEnabled?: boolean;
// // //     authenticityStatus?: string;
// // //     stadium?: string;
// // //     isViewed?: boolean;
// // // }

// // // interface StoryCardProps {
// // //     story: {
// // //         id: number;
// // //         locationImage: string;
// // //         image: string;
// // //         location: string;
// // //         description?: string;
// // //         activityStarted: Date;
// // //         activityEnded: Date;
// // //         participants?: number;
// // //         createdAt: string;
// // //         sport?: string;
// // //         endTime: Date;
// // //         author: {
// // //             username: string;
// // //             image?: string;
// // //             userId: string;
// // //         };
// // //         Storyimages?: {
// // //             id: number;
// // //             userId: string;
// // //             url?: string;
// // //         }[];
// // //         swipeUpEnabled?: boolean;
// // //         authenticityStatus?: string;
// // //         stadium?: string;
// // //         isViewed?: boolean;
// // //     };
// // //     isViewed?: boolean;
// // //     onClose: () => void;
// // // }


// // // export const StoryCard: React.FC<StoryCardProps> = ({ story }) => {

// // //     const [isViewedingStory, setisViewedingStory] = useState(false);
// // //     const [isViewed, setisViewed] = useState(story.isViewed || false);  // Track if the story is isViewed
// // //     // const navigate = useNavigate();


// // //     const handleOpenStory = async () => {
// // //         setisViewedingStory(true);
// // //         setisViewed(true); // Update local state

// // //         const token = localStorage.getItem('token');
// // //         try {
// // //             await fetch(`${BACKEND_URL}/api/v1/story/view`, {
// // //                 method: 'POST',
// // //                 headers: { 
// // //                     'Content-Type': 'application/json',
// // //                     Authorization: token ?? "",
// // //                  },
// // //                 body: JSON.stringify({ storyId: story.id }),
// // //             });
// // //             // await fetch(`${BACKEND_URL}/api/v1/story/view`, {
// // //             //     method: 'POST',
// // //             //     headers: { 'Content-Type': 'application/json' },
// // //             //     body: JSON.stringify({ storyId: story.id, userId: <loggedInUserId>, isViewed: true }),
// // //             // });
// // //         } catch (error) {
// // //             console.error('Error updating story view status:', error);
// // //         }
// // //     };


// // //     if (!story) return null;

// // //     const images = Array.isArray(story.Storyimages) ? story.Storyimages.map((image) => ({
// // //         id: image?.id,
// // //         url: image?.url,
// // //         userId: image?.userId?.toString()
// // //     })) : [];

// // //     if (images.length === 0) {
// // //         return <div>No images available.</div>;
// // //     }

// // //     return (
// // //         <>
// // //             <div 
// // //                 className="flex flex-col items-center hover:bg-muted justify-center gap-1 cursor-pointer"
// // //                 onClick={handleOpenStory}  // Call handleOpenStory instead
// // //             >
// // //                 <div className={`p-[2px] rounded-full ${isViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 to-pink-600'}`}>
// // //                     <div className="bg-white dark:bg-gray-800 p-[2px] rounded-full">
// // //                         <img
// // //                             src={story.locationImage}
// // //                             alt={story.location}
// // //                             className="w-14 h-14 rounded-full object-cover"
// // //                         />
// // //                     </div>
// // //                 </div>
// // //                 <span className="text-xs truncate w-16 dark:text-slate-300 text-center">{story.location}</span>
// // //             </div>

// // //             {isViewedingStory && (
// // //                 <StoryView
// // //                     // isViewedingStory={isViewedingStory}
// // //                     story={{
// // //                         id: story.id,
// // //                         locationImage: story.locationImage,
// // //                         image: story.locationImage,
// // //                         location: story.location,
// // //                         description: story.description,
// // //                         participants: story.participants,
// // //                         createdAt: story.createdAt,
// // //                         sport: story.sport,
// // //                         activityEnded: story.activityEnded,
// // //                         activityStarted: story.activityStarted,
// // //                         endTime: story.endTime,
// // //                         authenticityStatus: story.authenticityStatus,
// // //                         stadium: story.stadium,
// // //                         swipeUpEnabled: story.swipeUpEnabled,
// // //                         Storyimages: images,
// // //                         author: {
// // //                             username: story.author?.username || "hello",
// // //                             image: story.author?.image,
// // //                             userId: story.author?.userId || ""
// // //                         }
// // //                     }}
// // //                     onClose={() => setisViewedingStory(false)}
// // //                 />
// // //             )}
// // //         </>
// // //     );
// // // }
// // // 
// // // export default StoryCard;


// // // this is to demonstate that use of interface and then before declare a fun to be eported 
// // // this is each story circle that will be shown in the home page

// // // import { useState } from 'react';
// // // import { StoryView } from './StoryView';
// // // import { useNavigate } from 'react-router-dom';
// // // import { BACKEND_URL } from '../../config';
// // // import { Story } from '../../hooks/useStories';


// // // interface StoryCardProps {
// // //   story: Story;
// // //   onClose: () => void;
// // // }

// // // // export interface StoryType {
// // // //     id: number;
// // // //     locationImage: string;
// // // //     image: string;
// // // //     location: string;
// // // //     description?: string;
// // // //     activityStarted: Date;
// // // //     activityEnded: Date;
// // // //     participants?: number;
// // // //     createdAt: string;
// // // //     sport?: string;
// // // //     endTime: Date; //HERE was any
// // // //     author: {
// // // //         username: string;
// // // //         image?: string;
// // // //         userId: string;
// // // //     };
// // // //     Storyimages: {
// // // //         id: number;
// // // //         url?: string;
// // // //         userId: string;
// // // //     }[];
// // // //     swipeUpEnabled?: boolean;
// // // //     authenticityStatus?: string;
// // // //     stadium?: string;
// // // //     isViewed?: boolean;
// // // // }

// // // // interface StoryCardProps {
// // // //     story: {
// // // //         id: number;
// // // //         locationImage: string;
// // // //         location: string;
// // // //         description?: string;
// // // //         activityStarted: Date;
// // // //         activityEnded: Date;
// // // //         participants?: number;
// // // //         createdAt: string;
// // // //         sport?: string;
// // // //         endTime: Date;
// // // //         author: {
// // // //             username: string;
// // // //             image?: string;
// // // //             userId: string;
// // // //         };
// // // //         Storyimages?: {
// // // //             id: number;
// // // //             userId: number;
// // // //             url: string;
// // // //         }[];
// // // //         swipeUpEnabled?: boolean;
// // // //         authenticityStatus?: string;
// // // //         stadium?: string;
// // // //         isViewed?: boolean;
// // // //     };
// // // //     isViewed?: boolean;
// // // //     onClose: () => void;
// // // // }


// // // export const StoryCard: React.FC<StoryCardProps> = ({ story, onClose }) => {

// // //     const [isViewedingStory, setisViewedingStory] = useState(false);
// // //     const [isViewed, setisViewed] = useState(story.isViewed || false);  // Track if the story is isViewed
// // //     const navigate = useNavigate();


// // //     const handleOpenStory = async () => {
// // //         setisViewedingStory(true);
// // //         setisViewed(true); // Update local state

// // //         try {
// // //             await fetch(`${BACKEND_URL}/api/v1/story/view`, {
// // //                 method: 'POST',
// // //                 headers: { 'Content-Type': 'application/json' },
// // //                 body: JSON.stringify({ storyId: story.id, isViewed: true }),
// // //             });
// // //             // await fetch(`${BACKEND_URL}/api/v1/story/view`, {
// // //             //     method: 'POST',
// // //             //     headers: { 'Content-Type': 'application/json' },
// // //             //     body: JSON.stringify({ storyId: story.id, userId: <loggedInUserId>, isViewed: true }),
// // //             // });
// // //         } catch (error) {
// // //             console.error('Error updating story view status:', error);
// // //         }
// // //     };


// // //     if (!story) {
// // //         return (
// // //             <div
// // //                 className="flex flex-col items-center justify-center gap-1 cursor-pointer"
// // //                 onClick={() => navigate("/add-story")} // why still here 
// // //             >
// // //                 <div className="p-[2px] rounded-full bg-gray-300 relative">
// // //                     <div className="bg-white p-[2px] rounded-full flex items-center justify-center w-40 h-14">
// // //                         <span className="text-2xl font-bold text-gray-500">+</span>
// // //                     </div>
// // //                 </div>
// // //                 <span className="text-xs truncate w-16 text-center text-gray-500">Add Story</span>
// // //             </div>
// // //         );
// // //     }

// // //     const images = Array.isArray(story.Storyimages) ? story.Storyimages.map((image) => ({
// // //         id: image?.id,
// // //         url: image?.url,
// // //         userId: image?.userId?.toString()
// // //     })) : [];

// // //     if (images.length === 0) {
// // //         return <div>No images available.</div>;
// // //     }

// // //     return (
// // //         <>
// // //             <div 
// // //                 className="flex flex-col items-center hover:bg-muted justify-center gap-1 cursor-pointer"
// // //                 onClick={handleOpenStory}  // Call handleOpenStory instead
// // //             >
// // //                 <div className={`p-[2px] rounded-full ${isViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 to-pink-600'}`}>
// // //                     <div className="bg-white p-[2px] rounded-full">
// // //                         <img
// // //                             src={story.locationImage}
// // //                             alt={story.location}
// // //                             className="w-14 h-14 rounded-full object-cover"
// // //                         />
// // //                     </div>
// // //                 </div>
// // //                 <span className="text-xs truncate w-16 dark:text-slate-300 text-center">{story.location}</span>
// // //             </div>

// // //             {isViewedingStory && (
// // //                 <StoryView
// // //                     // isViewedingStory={isViewedingStory}
// // //                     story={{
// // //                         id: story.id,
// // //                         locationImage: story.locationImage,
// // //                         image: story.locationImage,
// // //                         location: story.location,
// // //                         description: story.description,
// // //                         participants: story.participants,
// // //                         createdAt: story.createdAt,
// // //                         sport: story.sport,
// // //                         activityEnded: story.activityEnded,
// // //                         activityStarted: story.activityStarted,
// // //                         endTime: story.endTime,
// // //                         authenticityStatus: story.authenticityStatus,
// // //                         stadium: story.stadium,
// // //                         swipeUpEnabled: story.swipeUpEnabled,
// // //                         Storyimages: images,
// // //                         author: {
// // //                             username: story.author?.username || "hello",
// // //                             image: story.author?.image,
// // //                             userId: story.author?.userId || ""
// // //                         }
// // //                     }}
// // //                     onClose={() => setisViewedingStory(false)}
// // //                 />
// // //             )}
// // //         </>
// // //     );
// // // }


// // // export default StoryCard;