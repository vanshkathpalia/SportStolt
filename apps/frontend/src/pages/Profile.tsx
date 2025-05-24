import { useState } from 'react';
import { ProfileGrid } from '../components/Profile/ProfileGrid';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { ProfileTabs } from '../components/Profile/ProfileTabs';
import { useProfileContent } from '../hooks/useProfileContent';
import { Sidebar } from '../components/StickyBars/Sidebar';
import { EventGrid } from '../components/Profile/EventGrid';
import { MobileNav } from '../components/StickyBars/MobileNav';
import { useMediaQuery } from '../hooks/useMediaQuery';

// import { EventGrid } from '../components/Profile/EventGrid';
// import { SavedGrid } from '../components/Profile/SavedGrid';

// interface ProfileType {
//   openCreateModal: () => void;
// }

export const Profile: React.FC<{ openCreateModal: () => void }> = ({ openCreateModal }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'events' | 'saved'>('posts');
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  const userId = 1; // Replace with actual user ID later

  const { loading, posts, events, error } = useProfileContent(userId, activeTab);

  return (
    <div className="min-h-screen bg-background">

        {isMobile && <MobileNav openCreateModal={openCreateModal} />}

        {/* Fixed Sidebar */}
        <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
          <Sidebar openCreateModal={openCreateModal} />
        </div>


      <main className="flex-1 md:ml-16 xl:ml-56 pb-16 md:pb-8">
        <div className="mx-auto dark:bg-background bg-background min-h-screen px-4">
          <ProfileHeader isLoading={loading} userId={userId} />
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isLoading={loading} />

          {error && <p className="text-red-500">{error}</p>}

          {/* Pass the data for the active tab to your grid or list */}
          {activeTab === 'posts' && <ProfileGrid posts={posts} isLoading={loading} />}
          {activeTab === 'events' && <EventGrid events={events} isLoading={loading} />}
          {/* {activeTab === 'saved' && <SavedGrid saved={saved} isLoading={loading} />} */}
        </div>
      </main>
    </div>
  );
};


// import React, { useState, useEffect } from 'react';
// import { ProfileHeader } from '../components/Profile/ProfileHeader';
// import { ProfileTabs } from '../components/Profile/ProfileTabs';
// import { ProfileGrid } from '../components/Profile/ProfileGrid';
// // import { Appbar } from '../components/StickyBars/Appbar';
// import { Sidebar } from '../components/StickyBars/Sidebar';


// export const Profile: React.FC<{ openCreateModal: () => void }> = ({openCreateModal}) => {
//   const [posts, setPosts] = useState<PostType[]>([]);
//   const [events, setEvents] = useState<EventType[]>([]);
//   const [saved, setSaved] = useState<SavedType[]>([]);

//   const [isLoadingData, setIsLoadingData] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('posts');

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1500);

//     return () => clearTimeout(timer);
//   }, []);

//   const userId = 1; // Replace with actual user ID later

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Fixed Sidebar */}
//       <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
//         <Sidebar openCreateModal={openCreateModal} />
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 md:ml-16 xl:ml-56 pb-16 md:pb-8">
//         <div className="mx-auto dark:bg-background bg-background min-h-screen px-4">
//           <ProfileHeader isLoading={isLoading} userId={userId} />
//           <ProfileTabs
//             activeTab={activeTab}
//             onTabChange={setActiveTab}
//             isLoading={isLoading}
//           />
//           <ProfileGrid
//             isLoading={isLoading || isLoadingData}
//             activeTab={activeTab}
//             posts={posts}
//             events={events}
//             saved={saved}
//           />

//         </div>
//       </main>
//     </div>
//   );
// };