import { useState } from 'react';
import { StoryView } from './StoryView';
import { BACKEND_URL } from '../../config';

export interface StoryType {
  id: number;
  locationImage: string;
  image: string;
  location: string;
  description?: string;
  activityStarted: Date;
  activityEnded: Date;
  participants?: number;
  createdAt: string;
  sport?: string;
  endTime: Date;
  author: {
    username: string;
    image?: string;
    userId: string;
  };
  Storyimages?: {
    id: number;
    url?: string;
    userId: string;
  }[];
  swipeUpEnabled?: boolean;
  authenticityStatus?: string;
  stadium?: string;
  viewed?: boolean;
}

interface StoryCardProps {
  story: StoryType;
  viewed?: boolean;
  onClose: () => void;
  filterBy?: 'location' | 'sport' | null;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, filterBy }) => {
  const [viewedingStory, setviewedingStory] = useState(false);
  const [viewed, setviewed] = useState(story.viewed || false);

  const handleOpenStory = async () => {
    setviewedingStory(true);
    setviewed(true);

    const token = localStorage.getItem('token');
    try {
      await fetch(`${BACKEND_URL}/api/v1/story/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ?? '',
        },
        body: JSON.stringify({ storyId: story.id }),
      });
    } catch (error) {
      console.error('Error updating story view status:', error);
    }
  };

  if (!story) return null;

  const images = Array.isArray(story.Storyimages)
    ? story.Storyimages.map((image) => ({
        id: image?.id,
        url: image?.url,
        userId: image?.userId?.toString(),
      }))
    : [];

  if (images.length === 0) {
    return <div>No images available.</div>;
  }

  console.log('filterBy', filterBy);    
  // Determine the label to display based on the filter
  let label: string;
  if (filterBy === 'location') {
    label = story.location;
  } else if (filterBy === 'sport') {
    label = story.sport || 'Unknown Sport';
  } else {
    const date = new Date(story.activityStarted);
    label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
//   let displayLabel: string;
//   if (filterBy === 'location') {
//     displayLabel = story.location;
//   } else if (filterBy === 'sport') {
//     displayLabel = story.sport || '';
//   } else {
//     // Format activityStarted time
//     const activityDate = new Date(story.activityStarted);
//     displayLabel = activityDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   }

  return (
    <>
      <div
        className="flex flex-col items-center hover:bg-muted justify-center gap-1 cursor-pointer"
        onClick={handleOpenStory}
      >
        <div
          className={`p-[2px] rounded-full ${
            viewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 to-pink-600'
          }`}
        >
          <div className="bg-white dark:bg-gray-800 p-[2px] rounded-full">
            <img
              src={story.locationImage}
              alt={story.location}
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>
        </div>
        <span className="text-xs truncate w-16 dark:text-slate-300 text-center">
          {label}
        </span>
      </div>

      {viewedingStory && (
        <StoryView
          story={{
            id: story.id,
            locationImage: story.locationImage,
            image: story.locationImage,
            location: story.location,
            description: story.description,
            participants: story.participants,
            createdAt: story.createdAt,
            sport: story.sport,
            activityEnded: story.activityEnded,
            activityStarted: story.activityStarted,
            endTime: story.endTime,
            authenticityStatus: story.authenticityStatus,
            stadium: story.stadium,
            swipeUpEnabled: story.swipeUpEnabled,
            Storyimages: images,
            author: {
              username: story.author?.username || 'hello',
              image: story.author?.image,
              userId: story.author?.userId || '',
            },
          }}
          onClose={() => setviewedingStory(false)}
        />
      )}
    </>
  );
};

export default StoryCard;


// // this is each story circle that will be shown in the home page

// import { useState } from 'react';
// import { StoryView } from './StoryView';
// // import { useNavigate } from 'react-router-dom';
// import { BACKEND_URL } from '../../config';


// export interface StoryType {
//     id: number;
//     locationImage: string;
//     image: string;
//     location: string;
//     description?: string;
//     activityStarted: Date;
//     activityEnded: Date;
//     participants?: number;
//     createdAt: string;
//     sport?: string;
//     endTime: Date; //HERE was any
//     author: {
//         username: string;
//         image?: string;
//         userId: string;
//     };
//     Storyimages: {
//         id: number;
//         url?: string;
//         userId: string;
//     }[];
//     swipeUpEnabled?: boolean;
//     authenticityStatus?: string;
//     stadium?: string;
//     viewed?: boolean;
// }

// interface StoryCardProps {
//     story: {
//         id: number;
//         locationImage: string;
//         image: string;
//         location: string;
//         description?: string;
//         activityStarted: Date;
//         activityEnded: Date;
//         participants?: number;
//         createdAt: string;
//         sport?: string;
//         endTime: Date;
//         author: {
//             username: string;
//             image?: string;
//             userId: string;
//         };
//         Storyimages?: {
//             id: number;
//             userId: string;
//             url?: string;
//         }[];
//         swipeUpEnabled?: boolean;
//         authenticityStatus?: string;
//         stadium?: string;
//         viewed?: boolean;
//     };
//     viewed?: boolean;
//     onClose: () => void;
// }


// export const StoryCard: React.FC<StoryCardProps> = ({ story }) => {

//     const [viewedingStory, setviewedingStory] = useState(false);
//     const [viewed, setviewed] = useState(story.viewed || false);  // Track if the story is viewed
//     // const navigate = useNavigate();


//     const handleOpenStory = async () => {
//         setviewedingStory(true);
//         setviewed(true); // Update local state

//         const token = localStorage.getItem('token');
//         try {
//             await fetch(`${BACKEND_URL}/api/v1/story/view`, {
//                 method: 'POST',
//                 headers: { 
//                     'Content-Type': 'application/json',
//                     Authorization: token ?? "",
//                  },
//                 body: JSON.stringify({ storyId: story.id }),
//             });
//             // await fetch(`${BACKEND_URL}/api/v1/story/view`, {
//             //     method: 'POST',
//             //     headers: { 'Content-Type': 'application/json' },
//             //     body: JSON.stringify({ storyId: story.id, userId: <loggedInUserId>, viewed: true }),
//             // });
//         } catch (error) {
//             console.error('Error updating story view status:', error);
//         }
//     };


//     if (!story) return null;

//     const images = Array.isArray(story.Storyimages) ? story.Storyimages.map((image) => ({
//         id: image?.id,
//         url: image?.url,
//         userId: image?.userId?.toString()
//     })) : [];

//     if (images.length === 0) {
//         return <div>No images available.</div>;
//     }

//     return (
//         <>
//             <div 
//                 className="flex flex-col items-center hover:bg-muted justify-center gap-1 cursor-pointer"
//                 onClick={handleOpenStory}  // Call handleOpenStory instead
//             >
//                 <div className={`p-[2px] rounded-full ${viewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 to-pink-600'}`}>
//                     <div className="bg-white dark:bg-gray-800 p-[2px] rounded-full">
//                         <img
//                             src={story.locationImage}
//                             alt={story.location}
//                             className="w-14 h-14 rounded-full object-cover"
//                         />
//                     </div>
//                 </div>
//                 <span className="text-xs truncate w-16 dark:text-slate-300 text-center">{story.location}</span>
//             </div>

//             {viewedingStory && (
//                 <StoryView
//                     // viewedingStory={viewedingStory}
//                     story={{
//                         id: story.id,
//                         locationImage: story.locationImage,
//                         image: story.locationImage,
//                         location: story.location,
//                         description: story.description,
//                         participants: story.participants,
//                         createdAt: story.createdAt,
//                         sport: story.sport,
//                         activityEnded: story.activityEnded,
//                         activityStarted: story.activityStarted,
//                         endTime: story.endTime,
//                         authenticityStatus: story.authenticityStatus,
//                         stadium: story.stadium,
//                         swipeUpEnabled: story.swipeUpEnabled,
//                         Storyimages: images,
//                         author: {
//                             username: story.author?.username || "hello",
//                             image: story.author?.image,
//                             userId: story.author?.userId || ""
//                         }
//                     }}
//                     onClose={() => setviewedingStory(false)}
//                 />
//             )}
//         </>
//     );
// }
// 
// export default StoryCard;


// this is to demonstate that use of interface and then before declare a fun to be eported 
// this is each story circle that will be shown in the home page

// import { useState } from 'react';
// import { StoryView } from './StoryView';
// import { useNavigate } from 'react-router-dom';
// import { BACKEND_URL } from '../../config';
// import { Story } from '../../hooks/useStories';


// interface StoryCardProps {
//   story: Story;
//   onClose: () => void;
// }

// // export interface StoryType {
// //     id: number;
// //     locationImage: string;
// //     image: string;
// //     location: string;
// //     description?: string;
// //     activityStarted: Date;
// //     activityEnded: Date;
// //     participants?: number;
// //     createdAt: string;
// //     sport?: string;
// //     endTime: Date; //HERE was any
// //     author: {
// //         username: string;
// //         image?: string;
// //         userId: string;
// //     };
// //     Storyimages: {
// //         id: number;
// //         url?: string;
// //         userId: string;
// //     }[];
// //     swipeUpEnabled?: boolean;
// //     authenticityStatus?: string;
// //     stadium?: string;
// //     viewed?: boolean;
// // }

// // interface StoryCardProps {
// //     story: {
// //         id: number;
// //         locationImage: string;
// //         location: string;
// //         description?: string;
// //         activityStarted: Date;
// //         activityEnded: Date;
// //         participants?: number;
// //         createdAt: string;
// //         sport?: string;
// //         endTime: Date;
// //         author: {
// //             username: string;
// //             image?: string;
// //             userId: string;
// //         };
// //         Storyimages?: {
// //             id: number;
// //             userId: number;
// //             url: string;
// //         }[];
// //         swipeUpEnabled?: boolean;
// //         authenticityStatus?: string;
// //         stadium?: string;
// //         viewed?: boolean;
// //     };
// //     viewed?: boolean;
// //     onClose: () => void;
// // }


// export const StoryCard: React.FC<StoryCardProps> = ({ story, onClose }) => {

//     const [viewedingStory, setviewedingStory] = useState(false);
//     const [viewed, setviewed] = useState(story.viewed || false);  // Track if the story is viewed
//     const navigate = useNavigate();


//     const handleOpenStory = async () => {
//         setviewedingStory(true);
//         setviewed(true); // Update local state

//         try {
//             await fetch(`${BACKEND_URL}/api/v1/story/view`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ storyId: story.id, viewed: true }),
//             });
//             // await fetch(`${BACKEND_URL}/api/v1/story/view`, {
//             //     method: 'POST',
//             //     headers: { 'Content-Type': 'application/json' },
//             //     body: JSON.stringify({ storyId: story.id, userId: <loggedInUserId>, viewed: true }),
//             // });
//         } catch (error) {
//             console.error('Error updating story view status:', error);
//         }
//     };


//     if (!story) {
//         return (
//             <div
//                 className="flex flex-col items-center justify-center gap-1 cursor-pointer"
//                 onClick={() => navigate("/add-story")} // why still here 
//             >
//                 <div className="p-[2px] rounded-full bg-gray-300 relative">
//                     <div className="bg-white p-[2px] rounded-full flex items-center justify-center w-40 h-14">
//                         <span className="text-2xl font-bold text-gray-500">+</span>
//                     </div>
//                 </div>
//                 <span className="text-xs truncate w-16 text-center text-gray-500">Add Story</span>
//             </div>
//         );
//     }

//     const images = Array.isArray(story.Storyimages) ? story.Storyimages.map((image) => ({
//         id: image?.id,
//         url: image?.url,
//         userId: image?.userId?.toString()
//     })) : [];

//     if (images.length === 0) {
//         return <div>No images available.</div>;
//     }

//     return (
//         <>
//             <div 
//                 className="flex flex-col items-center hover:bg-muted justify-center gap-1 cursor-pointer"
//                 onClick={handleOpenStory}  // Call handleOpenStory instead
//             >
//                 <div className={`p-[2px] rounded-full ${viewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 to-pink-600'}`}>
//                     <div className="bg-white p-[2px] rounded-full">
//                         <img
//                             src={story.locationImage}
//                             alt={story.location}
//                             className="w-14 h-14 rounded-full object-cover"
//                         />
//                     </div>
//                 </div>
//                 <span className="text-xs truncate w-16 dark:text-slate-300 text-center">{story.location}</span>
//             </div>

//             {viewedingStory && (
//                 <StoryView
//                     // viewedingStory={viewedingStory}
//                     story={{
//                         id: story.id,
//                         locationImage: story.locationImage,
//                         image: story.locationImage,
//                         location: story.location,
//                         description: story.description,
//                         participants: story.participants,
//                         createdAt: story.createdAt,
//                         sport: story.sport,
//                         activityEnded: story.activityEnded,
//                         activityStarted: story.activityStarted,
//                         endTime: story.endTime,
//                         authenticityStatus: story.authenticityStatus,
//                         stadium: story.stadium,
//                         swipeUpEnabled: story.swipeUpEnabled,
//                         Storyimages: images,
//                         author: {
//                             username: story.author?.username || "hello",
//                             image: story.author?.image,
//                             userId: story.author?.userId || ""
//                         }
//                     }}
//                     onClose={() => setviewedingStory(false)}
//                 />
//             )}
//         </>
//     );
// }


// export default StoryCard;