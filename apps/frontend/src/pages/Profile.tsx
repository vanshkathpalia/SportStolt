import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProfileContent } from "../hooks/useProfileContent";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { MobileNav } from "../components/StickyBars/MobileNav";
import { Sidebar } from "../components/StickyBars/Sidebar";
import { ProfileHeader } from "../components/Profile/ProfileHeader";
import { ProfileTabs } from "../components/Profile/ProfileTabs";
import { ProfileGrid } from "../components/Profile/PhotoGrid";
import { EventGrid } from "../components/Profile/EventGrid";
import { useAuth } from "../context/useAuth";
import { getUserIdFromUsername } from "../utils/getUserIdFromUsername";

export const Profile: React.FC<{ openCreateModal: () => void }> = ({ openCreateModal }) => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [userId, setUserId] = useState<number | null>(null);
  const [resolvingUserId, setResolvingUserId] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "events" | "saved">("posts");

  // Resolve userId on username or user change
  useEffect(() => {
    let isCancelled = false;

    async function resolveUserId() {
      setResolvingUserId(true);
      try {
        if (!username) {
          if (user?.id) {
            if (!isCancelled) setUserId(user.id);
          } else {
            if (!isCancelled) setUserId(null);
          }
        } else {
          const id = await getUserIdFromUsername(username);
          if (!isCancelled) setUserId(id);
        }
      } catch {
        if (!isCancelled) setUserId(null);
      } finally {
        if (!isCancelled) setResolvingUserId(false);
      }
    }

    resolveUserId();

    return () => {
      isCancelled = true;
    };
  }, [username, user]);

  const userIdValid = userId !== null && userId > 0;

  // Fetch profile content only if userId is valid
  const { loading, posts, events } = useProfileContent(userIdValid ? userId : undefined, activeTab);
  // const { error } = useProfileContent(userIdValid ? userId : undefined, activeTab);

  if (resolvingUserId) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {isMobile && <MobileNav openCreateModal={openCreateModal} />}
        <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
          <Sidebar openCreateModal={openCreateModal} />
        </div>
        <main className="flex-1 md:ml-16 xl:ml-56 pb-16 md:pb-8 flex items-center justify-center">
          <p className="text-gray-500 text-lg select-none">Loading profile...</p>
        </main>
      </div>
    );
  }

  if (!userIdValid) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {isMobile && <MobileNav openCreateModal={openCreateModal} />}
        <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
          <Sidebar openCreateModal={openCreateModal} />
        </div>
        <main className="flex-1 md:ml-16 xl:ml-56 pb-16 md:pb-8 flex items-center justify-center">
          <p className="text-red-500 text-lg select-none">User not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isMobile && <MobileNav openCreateModal={openCreateModal} />}
      <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
        <Sidebar openCreateModal={openCreateModal} />
      </div>

      <main className="flex-1 md:ml-16 xl:ml-56 pb-16 md:pb-8">
        <div className="mx-auto bg-background min-h-screen px-4">
          {/* Header & Tabs always render immediately */}
          <ProfileHeader isLoading={loading} userId={userId} />
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isLoading={loading} />

          {/* Error */}
          {/* {error && <p className="text-red-500 my-4">{error}</p>} */}

          {/* Conditionally show content with graceful loading */}
          {activeTab === "posts" && <ProfileGrid posts={posts} isLoading={loading} />}
          {activeTab === "events" && <EventGrid events={events} isLoading={loading} />}
          {/* Saved tab UI placeholder */}
          {/* {activeTab === 'saved' && <SavedGrid saved={saved} isLoading={loading} />} */}
        </div>
      </main>
    </div>
  );
};


// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { ProfileGrid } from '../components/Profile/ProfileGrid';
// import { ProfileHeader } from '../components/Profile/ProfileHeader';
// import { ProfileTabs } from '../components/Profile/ProfileTabs';
// import { useProfileContent } from '../hooks/useProfileContent';
// import { Sidebar } from '../components/StickyBars/Sidebar';
// import { EventGrid } from '../components/Profile/EventGrid';
// import { MobileNav } from '../components/StickyBars/MobileNav';
// import { useMediaQuery } from '../hooks/useMediaQuery';
// import { BACKEND_URL } from '../config';
// import { useAuth } from '../context/AuthContext';

// export const Profile: React.FC<{ openCreateModal: () => void }> = ({ openCreateModal }) => {
  
//   const { username } = useParams<{ username: string }>(); // Type the param for better TS support
//   const [userId, setUserId] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState<'posts' | 'events' | 'saved'>('posts');
//   const [resolvingUserId, setResolvingUserId] = useState(true);
//   const isMobile = useMediaQuery("(max-width: 768px)");
//   const { user } = useAuth();

//   // if (!user) return;

//   // console.log("Fetching from:", `${BACKEND_URL}/api/v1/user/id/${username}`);

//   useEffect(() => {
//     setResolvingUserId(true);

//     if (!username) {
//       if (user?.id) {
//         setUserId(user.id);
//         setResolvingUserId(false);
//       } else {
//         // No username in route and no logged-in user -> no userId
//         setUserId(null);
//         setResolvingUserId(false);
//       }
//     } else {
//       getUserIdFromUsername(username)
//         .then((id) => {
//           setUserId(id);
//           setResolvingUserId(false);
//         })
//         .catch((err) => {
//           console.error(err);
//           setUserId(null);
//           setResolvingUserId(false);
//         });
//     }
//   }, [username, user]);

//   // Only valid userId (positive number)
//   const userIdValid = userId !== null && userId > 0;

//   // Pass userId only if valid, else undefined
//   const { loading, posts, events } = useProfileContent(userIdValid ? userId : undefined, activeTab);
//   // const { error } = useProfileContent(userIdValid ? userId : undefined, activeTab);

//   // if (resolvingUserId) return <div>Loading profile...</div>;
//   // if (!userIdValid) return <div className="text-red-500">User not found</div>;

//   return (
//     <div className="min-h-screen bg-background">
//       {isMobile && <MobileNav openCreateModal={openCreateModal} />}
//       <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
//         <Sidebar openCreateModal={openCreateModal} />
//       </div>
//       <main className="flex-1 md:ml-16 xl:ml-56 pb-16 md:pb-8">
//         <div className="mx-auto bg-background min-h-screen px-4">
//           <ProfileHeader isLoading={loading || resolvingUserId} userId={userId ?? 0} />
//           <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isLoading={loading} />
//           {/* {error && <p className="text-red-500">{error}</p>} */}
//           {activeTab === 'posts' && <ProfileGrid posts={posts} isLoading={loading} />}
//           {activeTab === 'events' && <EventGrid events={events} isLoading={loading} />}
//           {/* Add saved tab UI here if you implement it */}
//         </div>
//       </main>
//     </div>
//   );
// };

// export async function getUserIdFromUsername(username: string): Promise<number> {
//   // console.log("Fetching userId for username:", username, "URL:", `${BACKEND_URL}/api/v1/user/id/${username}`);
//   const res = await fetch(`${BACKEND_URL}/api/v1/user/id/${username}`);

//   if (!res.ok) {
//     // console.error(`Failed to fetch user ID for username: ${username}, status: ${res.status}`);
//     throw new Error("User not found");
//   }

//   const data = await res.json();
//   // console.log("User ID response data:", data);

//   if (typeof data.id !== 'number') {
//     console.error("Invalid ID received:", data);
//     throw new Error("Invalid response");
//   }

//   return data.id;
// }

// export async function getUserIdFromUsername(username: string): Promise<number> {
//   const res = await fetch(`${BACKEND_URL}/api/v1/user/id/${username}`);

//   if (!res.ok) {
//     console.error(`Failed to fetch user ID for username: ${username}`);
//     throw new Error("User not found");
//   }

//   const data = await res.json();

//   if (typeof data.id !== 'number') {
//     console.error("Invalid ID received:", data);
//     throw new Error("Invalid response");
//   }

//   return data.id;
// }


// import { useState } from 'react';
// import { ProfileGrid } from '../components/Profile/ProfileGrid';
// import { ProfileHeader } from '../components/Profile/ProfileHeader';
// import { ProfileTabs } from '../components/Profile/ProfileTabs';
// import { useProfileContent } from '../hooks/useProfileContent';
// import { Sidebar } from '../components/StickyBars/Sidebar';
// import { EventGrid } from '../components/Profile/EventGrid';
// import { MobileNav } from '../components/StickyBars/MobileNav';
// import { useMediaQuery } from '../hooks/useMediaQuery';

// // import { EventGrid } from '../components/Profile/EventGrid';
// // import { SavedGrid } from '../components/Profile/SavedGrid';

// // interface ProfileType {
// //   openCreateModal: () => void;
// // }

// export const Profile: React.FC<{ openCreateModal: () => void }> = ({ openCreateModal }) => {
//   const [activeTab, setActiveTab] = useState<'posts' | 'events' | 'saved'>('posts');
//   const isMobile = useMediaQuery("(max-width: 768px)")
  
//   const userId = 1; // Replace with actual user ID later

//   const { loading, posts, events, error } = useProfileContent(userId, activeTab);

//   return (
//     <div className="min-h-screen bg-background">

//         {isMobile && <MobileNav openCreateModal={openCreateModal} />}

//         {/* Fixed Sidebar */}
//         <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
//           <Sidebar openCreateModal={openCreateModal} />
//         </div>


//       <main className="flex-1 md:ml-16 xl:ml-56 pb-16 md:pb-8">
//         <div className="mx-auto dark:bg-background bg-background min-h-screen px-4">
//           <ProfileHeader isLoading={loading} userId={userId} />
//           <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isLoading={loading} />

//           {error && <p className="text-red-500">{error}</p>}

//           {/* Pass the data for the active tab to your grid or list */}
//           {activeTab === 'posts' && <ProfileGrid posts={posts} isLoading={loading} />}
//           {activeTab === 'events' && <EventGrid events={events} isLoading={loading} />}
//           {/* {activeTab === 'saved' && <SavedGrid saved={saved} isLoading={loading} />} */}
//         </div>
//       </main>
//     </div>
//   );
// };


// // import React, { useState, useEffect } from 'react';
// // import { ProfileHeader } from '../components/Profile/ProfileHeader';
// // import { ProfileTabs } from '../components/Profile/ProfileTabs';
// // import { ProfileGrid } from '../components/Profile/ProfileGrid';
// // // import { Appbar } from '../components/StickyBars/Appbar';
// // import { Sidebar } from '../components/StickyBars/Sidebar';


// // export const Profile: React.FC<{ openCreateModal: () => void }> = ({openCreateModal}) => {
// //   const [posts, setPosts] = useState<PostType[]>([]);
// //   const [events, setEvents] = useState<EventType[]>([]);
// //   const [saved, setSaved] = useState<SavedType[]>([]);

// //   const [isLoadingData, setIsLoadingData] = useState(false);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [activeTab, setActiveTab] = useState('posts');

// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       setIsLoading(false);
// //     }, 1500);

// //     return () => clearTimeout(timer);
// //   }, []);

// //   const userId = 1; // Replace with actual user ID later

// //   return (
// //     <div className="min-h-screen bg-background">
// //       {/* Fixed Sidebar */}
// //       <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
// //         <Sidebar openCreateModal={openCreateModal} />
// //       </div>

// //       {/* Main Content */}
// //       <main className="flex-1 md:ml-16 xl:ml-56 pb-16 md:pb-8">
// //         <div className="mx-auto dark:bg-background bg-background min-h-screen px-4">
// //           <ProfileHeader isLoading={isLoading} userId={userId} />
// //           <ProfileTabs
// //             activeTab={activeTab}
// //             onTabChange={setActiveTab}
// //             isLoading={isLoading}
// //           />
// //           <ProfileGrid
// //             isLoading={isLoading || isLoadingData}
// //             activeTab={activeTab}
// //             posts={posts}
// //             events={events}
// //             saved={saved}
// //           />

// //         </div>
// //       </main>
// //     </div>
// //   );
// // };





// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { ProfileGrid } from '../components/Profile/ProfileGrid';
// import { ProfileHeader } from '../components/Profile/ProfileHeader';
// import { ProfileTabs } from '../components/Profile/ProfileTabs';
// import { useProfileContent } from '../hooks/useProfileContent';
// import { Sidebar } from '../components/StickyBars/Sidebar';
// import { EventGrid } from '../components/Profile/EventGrid';
// import { MobileNav } from '../components/StickyBars/MobileNav';
// import { useMediaQuery } from '../hooks/useMediaQuery';
// import { BACKEND_URL } from '../config';
// import { useAuth } from '../context/AuthContext';

// export const Profile: React.FC<{ openCreateModal: () => void }> = ({ openCreateModal }) => {
//   const { username } = useParams<{ username: string }>();
//   const [userId, setUserId] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState<'posts' | 'events' | 'saved'>('posts');
//   const [resolvingUserId, setResolvingUserId] = useState(true);
//   const [userIdError, setUserIdError] = useState<string | null>(null);
//   const isMobile = useMediaQuery("(max-width: 768px)");
//   const { user } = useAuth();

//   useEffect(() => {
//     setResolvingUserId(true);
//     setUserIdError(null);

//     if (!username) {
//       if (user?.id) {
//         setUserId(user.id);
//         setResolvingUserId(false);
//       } else {
//         setUserId(null);
//         setResolvingUserId(false);
//       }
//     } else {
//       getUserIdFromUsername(username)
//         .then((id) => {
//           setUserId(id);
//           setResolvingUserId(false);
//         })
//         .catch((err) => {
//           console.error(err);
//           setUserId(null);
//           setUserIdError(err.message || 'User not found');
//           setResolvingUserId(false);
//         });
//     }
//   }, [username, user]);

//   const userIdValid = userId !== null && userId > 0;

//   const { loading, posts, events, error } = useProfileContent(userIdValid ? userId : undefined, activeTab);

//   return (
//     <div className="min-h-screen bg-background">
//       {isMobile && <MobileNav openCreateModal={openCreateModal} />}
//       <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
//         <Sidebar openCreateModal={openCreateModal} />
//       </div>
//       <main className="flex-1 md:ml-16 xl:ml-56 pb-16 md:pb-8">
//         <div className="mx-auto bg-background min-h-screen px-4">
//           {/* ProfileHeader can show its own loading state */}
//           {/* <ProfileHeader isLoading={loading || resolvingUserId} userId={userId} /> */}
//           <ProfileHeader isLoading={loading || resolvingUserId} userId={userId ?? 0} />

//           <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isLoading={loading || resolvingUserId} />

//           {/* Inline error or loading messages in content area */}
//           {resolvingUserId && (
//             <div className="text-center py-8 text-gray-500">Loading profile details...</div>
//           )}

//           {!resolvingUserId && userIdError && (
//             <div className="text-center py-8 text-red-500">{userIdError}</div>
//           )}

//           {!resolvingUserId && !userIdError && (
//             <>
//               {error && <p className="text-red-500">{error}</p>}

//               {activeTab === 'posts' && <ProfileGrid posts={posts} isLoading={loading} />}
//               {activeTab === 'events' && <EventGrid events={events} isLoading={loading} />}
//               {/* TODO: saved tab UI */}
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };


// // export const Profile: React.FC<{ openCreateModal: () => void }> = ({ openCreateModal }) => {
  
// //   const { username } = useParams<{ username: string }>(); // Type the param for better TS support
// //   const [userId, setUserId] = useState<number | null>(null);
// //   const [activeTab, setActiveTab] = useState<'posts' | 'events' | 'saved'>('posts');
// //   const [resolvingUserId, setResolvingUserId] = useState(true);
// //   const isMobile = useMediaQuery("(max-width: 768px)");
// //   const { user } = useAuth();

// //   // if (!user) return;

// //   // console.log("Fetching from:", `${BACKEND_URL}/api/v1/user/id/${username}`);

// //   useEffect(() => {
// //     setResolvingUserId(true);

// //     if (!username) {
// //       if (user?.id) {
// //         setUserId(user.id);
// //         setResolvingUserId(false);
// //       } else {
// //         // No username in route and no logged-in user -> no userId
// //         setUserId(null);
// //         setResolvingUserId(false);
// //       }
// //     } else {
// //       getUserIdFromUsername(username)
// //         .then((id) => {
// //           setUserId(id);
// //           setResolvingUserId(false);
// //         })
// //         .catch((err) => {
// //           console.error(err);
// //           setUserId(null);
// //           setResolvingUserId(false);
// //         });
// //     }
// //   }, [username, user]);

// //   // Only valid userId (positive number)
// //   const userIdValid = userId !== null && userId > 0;

// //   // Pass userId only if valid, else undefined
// //   const { loading, posts, events, error } = useProfileContent(userIdValid ? userId : undefined, activeTab);

// //   if (resolvingUserId) return <div>Loading profile...</div>;
// //   if (!userIdValid) return <div className="text-red-500">User not found</div>;

// //   return (
// //     <div className="min-h-screen bg-background">
// //       {isMobile && <MobileNav openCreateModal={openCreateModal} />}
// //       <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
// //         <Sidebar openCreateModal={openCreateModal} />
// //       </div>
// //       <main className="flex-1 md:ml-16 xl:ml-56 pb-16 md:pb-8">
// //         <div className="mx-auto bg-background min-h-screen px-4">
// //           <ProfileHeader isLoading={loading} userId={userId} />
// //           <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isLoading={loading} />
// //           {error && <p className="text-red-500">{error}</p>}
// //           {activeTab === 'posts' && <ProfileGrid posts={posts} isLoading={loading} />}
// //           {activeTab === 'events' && <EventGrid events={events} isLoading={loading} />}
// //           {/* Add saved tab UI here if you implement it */}
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// export async function getUserIdFromUsername(username: string): Promise<number> {
//   // console.log("Fetching userId for username:", username, "URL:", `${BACKEND_URL}/api/v1/user/id/${username}`);
//   const res = await fetch(`${BACKEND_URL}/api/v1/user/id/${username}`);

//   if (!res.ok) {
//     // console.error(`Failed to fetch user ID for username: ${username}, status: ${res.status}`);
//     throw new Error("User not found");
//   }

//   const data = await res.json();
//   // console.log("User ID response data:", data);

//   if (typeof data.id !== 'number') {
//     console.error("Invalid ID received:", data);
//     throw new Error("Invalid response");
//   }

//   return data.id;
// }

// // export async function getUserIdFromUsername(username: string): Promise<number> {
// //   const res = await fetch(`${BACKEND_URL}/api/v1/user/id/${username}`);

// //   if (!res.ok) {
// //     console.error(`Failed to fetch user ID for username: ${username}`);
// //     throw new Error("User not found");
// //   }

// //   const data = await res.json();

// //   if (typeof data.id !== 'number') {
// //     console.error("Invalid ID received:", data);
// //     throw new Error("Invalid response");
// //   }

// //   return data.id;
// // }


// // import { useState } from 'react';
// // import { ProfileGrid } from '../components/Profile/ProfileGrid';
// // import { ProfileHeader } from '../components/Profile/ProfileHeader';
// // import { ProfileTabs } from '../components/Profile/ProfileTabs';
// // import { useProfileContent } from '../hooks/useProfileContent';
// // import { Sidebar } from '../components/StickyBars/Sidebar';
// // import { EventGrid } from '../components/Profile/EventGrid';
// // import { MobileNav } from '../components/StickyBars/MobileNav';
// // import { useMediaQuery } from '../hooks/useMediaQuery';

// // // import { EventGrid } from '../components/Profile/EventGrid';
// // // import { SavedGrid } from '../components/Profile/SavedGrid';

// // // interface ProfileType {
// // //   openCreateModal: () => void;
// // // }

// // export const Profile: React.FC<{ openCreateModal: () => void }> = ({ openCreateModal }) => {
// //   const [activeTab, setActiveTab] = useState<'posts' | 'events' | 'saved'>('posts');
// //   const isMobile = useMediaQuery("(max-width: 768px)")
  
// //   const userId = 1; // Replace with actual user ID later

// //   const { loading, posts, events, error } = useProfileContent(userId, activeTab);

// //   return (
// //     <div className="min-h-screen bg-background">

// //         {isMobile && <MobileNav openCreateModal={openCreateModal} />}

// //         {/* Fixed Sidebar */}
// //         <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
// //           <Sidebar openCreateModal={openCreateModal} />
// //         </div>


// //       <main className="flex-1 md:ml-16 xl:ml-56 pb-16 md:pb-8">
// //         <div className="mx-auto dark:bg-background bg-background min-h-screen px-4">
// //           <ProfileHeader isLoading={loading} userId={userId} />
// //           <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isLoading={loading} />

// //           {error && <p className="text-red-500">{error}</p>}

// //           {/* Pass the data for the active tab to your grid or list */}
// //           {activeTab === 'posts' && <ProfileGrid posts={posts} isLoading={loading} />}
// //           {activeTab === 'events' && <EventGrid events={events} isLoading={loading} />}
// //           {/* {activeTab === 'saved' && <SavedGrid saved={saved} isLoading={loading} />} */}
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };


// // // import React, { useState, useEffect } from 'react';
// // // import { ProfileHeader } from '../components/Profile/ProfileHeader';
// // // import { ProfileTabs } from '../components/Profile/ProfileTabs';
// // // import { ProfileGrid } from '../components/Profile/ProfileGrid';
// // // // import { Appbar } from '../components/StickyBars/Appbar';
// // // import { Sidebar } from '../components/StickyBars/Sidebar';


// // // export const Profile: React.FC<{ openCreateModal: () => void }> = ({openCreateModal}) => {
// // //   const [posts, setPosts] = useState<PostType[]>([]);
// // //   const [events, setEvents] = useState<EventType[]>([]);
// // //   const [saved, setSaved] = useState<SavedType[]>([]);

// // //   const [isLoadingData, setIsLoadingData] = useState(false);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [activeTab, setActiveTab] = useState('posts');

// // //   useEffect(() => {
// // //     const timer = setTimeout(() => {
// // //       setIsLoading(false);
// // //     }, 1500);

// // //     return () => clearTimeout(timer);
// // //   }, []);

// // //   const userId = 1; // Replace with actual user ID later

// // //   return (
// // //     <div className="min-h-screen bg-background">
// // //       {/* Fixed Sidebar */}
// // //       <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
// // //         <Sidebar openCreateModal={openCreateModal} />
// // //       </div>

// // //       {/* Main Content */}
// // //       <main className="flex-1 md:ml-16 xl:ml-56 pb-16 md:pb-8">
// // //         <div className="mx-auto dark:bg-background bg-background min-h-screen px-4">
// // //           <ProfileHeader isLoading={isLoading} userId={userId} />
// // //           <ProfileTabs
// // //             activeTab={activeTab}
// // //             onTabChange={setActiveTab}
// // //             isLoading={isLoading}
// // //           />
// // //           <ProfileGrid
// // //             isLoading={isLoading || isLoadingData}
// // //             activeTab={activeTab}
// // //             posts={posts}
// // //             events={events}
// // //             saved={saved}
// // //           />

// // //         </div>
// // //       </main>
// // //     </div>
// // //   );
// // // };