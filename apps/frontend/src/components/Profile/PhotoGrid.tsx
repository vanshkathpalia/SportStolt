import { useEffect, useState } from "react";
import { PostType } from "../../hooks/profileTypes";
import { FullView } from "./FullView";

interface ProfileGridProps {
  isLoading?: boolean;
  posts?: PostType[];
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({ isLoading, posts }) => {
  const [delayed, setDelayed] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayed(false);
    }, 2000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || (posts?.length === 0 && delayed)) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <p className="text-center text-gray-400 pt-20">No posts found.</p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {posts.map((post) => (
        <FullView key={post.id} post={post} index={post.id} />
      ))}
    </div>
  );
};

// export const ProfileGrid: React.FC<ProfileGridProps> = ({ isLoading, posts }) => {
//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-3 gap-4">
//         {[...Array(6)].map((_, i) => (
//           <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   if (!posts || posts.length === 0) {
//     return (
//       <p className="text-center text-gray-400 pt-20">No posts found.</p>
//     );
//   }

//   return (
//     <div className="grid grid-cols-3 gap-4">
//       {posts.map((post) => (
//         <FullView key={post.id} post={post} index={post.id} />
//       ))}
//     </div>
//   );
// };

// export const ProfileGrid: React.FC<ProfileGridProps> = ({ isLoading, posts }) => {
//   const [showNoPostsMessage, setShowNoPostsMessage] = useState(false);

//   useEffect(() => {
//     let timer: NodeJS.Timeout | null = null;

//     if (isLoading) {
//       setShowNoPostsMessage(false);
//       timer = setTimeout(() => {
//         setShowNoPostsMessage(true);
//       }, 5000);
//     } else {
//       if (timer) clearTimeout(timer);
//       setShowNoPostsMessage(false);
//     }

//     return () => {
//       if (timer) clearTimeout(timer);
//     };
//   }, [isLoading]);

//   if (isLoading) {
//     return (
//         <div className="grid grid-cols-3 gap-4">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
//           ))}
//         </div>
//     );
//   }

//   // If posts is empty but timer not elapsed yet, keep showing "loading images" message
//   if (!posts || posts.length === 0) {
//     return (
//       <div className="grid grid-cols-3 gap-4">
//          {[...Array(6)].map((_, i) => (
//            <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
//          ))}
//        </div>
//     );
//   }

//   if ((!posts || posts.length === 0) && showNoPostsMessage) {
//     return <p className="text-center text-gray-400 pt-20">No posts found.</p>;
//   }

//   // Otherwise render posts
//   return (
//     <div className="grid grid-cols-3 gap-4">
//       {posts.map((post) => (
//         <FullView key={post.id} post={post} index={post.id} />
//       ))}
//     </div>
//   );
// };

// import { PostType } from "../../hooks/types";
// import { FullView } from "./FullView";

// interface ProfileGridProps {
//   isLoading?: boolean;
//   posts?: PostType[];
// }

// export const ProfileGrid: React.FC<ProfileGridProps> = ({ isLoading, posts }) => {
  
//   if ( isLoading ) {
//     return (
//       <div className="grid grid-cols-3 gap-4">
//         {[...Array(6)].map((_, i) => (
//           <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   if (!posts || posts.length === 0) {
//     return <p className="text-center text-gray-400 pt-20">No posts found.</p>;
//   }

//   return (
//     <div className="grid grid-cols-3 gap-4">
//       {posts.map((post) => (
//         <FullView post={post} index={post.id} />
//       ))}     
//     </div>     
//   );
// };



// import { useEffect, useState } from "react";
// import { PostType } from "../../hooks/types";
// import { FullView } from "./FullView";

// interface ProfileGridProps {
//   isLoading?: boolean;
//   posts?: PostType[];
// }
// export const ProfileGrid: React.FC<ProfileGridProps> = ({ isLoading, posts }) => {
//   const [minLoadingDone, setMinLoadingDone] = useState(false);

//   useEffect(() => {
//     let timer: NodeJS.Timeout | null = null;

//     if (isLoading) {
//       setMinLoadingDone(false);
//       timer = setTimeout(() => {
//         setMinLoadingDone(true);
//       }, 1500);
//     } else {
//       // Loading is false, but wait for timer to finish before hiding skeleton
//       if (!minLoadingDone) {
//         // If timer not done yet, wait until done
//         timer = setTimeout(() => {
//           setMinLoadingDone(true);
//         }, 1500);
//       } else {
//         setMinLoadingDone(true);
//       }
//     }

//     return () => {
//       if (timer) clearTimeout(timer);
//     };
//   }, [isLoading]);

//   if (isLoading || !minLoadingDone) {
//     // Show skeleton while loading or timer not finished
//     return (
//       <div className="grid grid-cols-3 gap-4">
//         {[...Array(6)].map((_, i) => (
//           <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   if (!posts || posts.length === 0) {
//     return <p className="text-center text-gray-400 pt-20">No posts found.</p>;
//   }

//   return (
//     <div className="grid grid-cols-3 gap-4">
//       {posts.map((post) => (
//         <FullView key={post.id} post={post} index={post.id} />
//       ))}
//     </div>
//   );
// };


// import { FullView } from "./FullView";

// interface ProfileGridProps {
//   isLoading?: boolean;
//   activeTab: string;
//   posts: PostType[];
//   events: EventType[];
//   saved: SavedType[];
// }

// export const ProfileGrid: React.FC<ProfileGridProps> = ({ isLoading, activeTab, posts, events, saved }) => {
//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-3 gap-2">
//         {[...Array(6)].map((_, i) => (
//           <div key={i} className="aspect-square bg-gray-200 animate-pulse w-96 h-96" />
//         ))}
//       </div>
//     );
//   }

//   if (activeTab === 'posts') {
//     return (
//       <div className="grid grid-cols-3 gap-1">
//         {posts.map((post, i) => (
//           <FullView key={post.id} post={post} index={i} />
//         ))}
//       </div>
//     );
//   }

//   if (activeTab === 'events') {
//     return (
//       <div>
//         {events.length === 0 ? (
//           <p className="text-center mt-4">No completed events found</p>
//         ) : (
//           events.map(event => (
//             <EventView key={event.id} event={event} />
//           ))
//         )}
//       </div>
//     );
//   }

//   if (activeTab === 'saved') {
//     return (
//       <div className="grid grid-cols-3 gap-1">
//         {saved.map((item, i) => (
//           <FullView key={item.post.id} post={item.post} index={i} />
//         ))}
//       </div>
//     );
//   }

//   return null;
// };

// import React from 'react';
// import { FullView } from './FullView';

// interface ProfileGridProps {
//   isLoading?: boolean;
// }

// export const ProfileGrid: React.FC<ProfileGridProps> = ({ isLoading }) => {
//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-3 gap-2">
//         {[...Array(6)].map((_, i) => (
//           <div key={i} className="aspect-square bg-gray-200 animate-pulse w-96 h-96" />
//         ))}
//       </div>
//     );
//   }

//   const posts = [
//     'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
//     'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
//     'https://images.unsplash.com/photo-1610147323479-a7fb11ffd5dd',
//     'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1',
//     'https://images.unsplash.com/photo-1682687221248-3116ba6ab483',
//     'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1',
//   ].map(url => `${url}?w=600&h=600&fit=crop`);

//   return (
//     <div className="grid grid-cols-3 gap-1">
//       {posts.map((post, index) => <FullView 
//           post = {post}
//           index = {index}
//       />)}
//     </div>
//   );
// };