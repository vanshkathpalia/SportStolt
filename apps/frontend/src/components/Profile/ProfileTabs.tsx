import React from 'react';
import { Grid, CalendarDays, Bookmark } from 'lucide-react';

interface ProfileTabsProps {
  activeTab: 'posts' | 'events' | 'saved';
  onTabChange: (tab: 'posts' | 'events' | 'saved') => void;
  isLoading?: boolean;
}

const tabs = [
  { key: 'posts', label: 'Posts', icon: Grid },
  { key: 'events', label: 'Events', icon: CalendarDays },
  { key: 'saved', label: 'Saved', icon: Bookmark },
] as const;

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange, isLoading }) => {
  if (isLoading) {
    return (
      <div className="border-t m-1 dark:border-gray-600 border-gray-200">
        <div className="flex justify-around">
          {tabs.map((_, i) => (
            <div key={i} className="h-12 w-24 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-t dark:text-gray-700 border-gray-200 dark:border-gray-600">
      <div className="flex justify-around">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`flex items-center gap-2 px-4 py-3 border-t-2 transition-colors duration-150 ${
              activeTab === key
                ? 'border-foreground text-black dark:text-white'
                : 'border-black text-gray-400 hover:text-gray-300'
            }`}
            disabled={isLoading}
          >
            <Icon className="w-4 h-4" />
            <span className="text-x uppercase font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};


// // ProfileTabs.tsx (or wherever your ProfileTabs component is)

// interface ProfileTabsProps {
//   activeTab: "posts" | "events" | "saved";
//   onTabChange: (tab: "posts" | "events" | "saved") => void;
//   isLoading: boolean;
// }

// export const ProfileTabs = ({ activeTab, onTabChange, isLoading }: ProfileTabsProps) => {
//   // Your tab logic here...
//   // For example, if you have buttons for tabs:
//   return (
//     <div>
//       {["posts", "events"].map((tab) => ( // , "saved" can be added if needed
//         <button
//           key={tab}
//           disabled={isLoading}
//           className={activeTab === tab ? "active" : ""}
//           onClick={() => onTabChange(tab as "posts" | "events")} // for saved later 
//           // | "saved" Cast if needed
//         >
//           {tab}
//         </button>
//       ))}
//     </div>
//   );
// };


// import React from 'react';
// import { Grid, Bookmark, Heart } from 'lucide-react';

// interface ProfileTabsProps {
//   activeTab: string;
//   onTabChange: (tab: string) => void;
//   isLoading?: boolean;
// }

// export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange, isLoading }) => {
//   if (isLoading) {
//     return (
//       <div className="border-t m-1 border-gray-200">
//         <div className="flex justify-around">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="h-12 w-24 bg-gray-200 animate-pulse" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   /* ontabchange is chaning the usestate in the profile, for then checking its type in here, we have to fetch diff data for each... */
//   return (
//     <div className="border-t border-gray-200">
//       <div className="flex justify-around">
//         <button
//           className={`flex items-center gap-2 px-4 py-3 border-t-2 ${
//             activeTab === 'posts' ? 'border-black text-black' : 'border-transparent text-gray-500'
//           }`}
//           onClick={() => onTabChange('posts')}
//         >
//           <Grid className="w-4 h-4" />
//           <span className="text-xs uppercase font-semibold">Posts</span>
//         </button>
//         <button
//           className={`flex items-center gap-2 px-4 py-3 border-t-2 ${
//             activeTab === 'saved' ? 'border-black text-black' : 'border-transparent text-gray-500'
//           }`}
//           onClick={() => onTabChange('saved')}
//         >
//           <Bookmark className="w-4 h-4" />
//           <span className="text-xs uppercase font-semibold">Saved</span>
//         </button>
//         <button
//           className={`flex items-center gap-2 px-4 py-3 border-t-2 ${
//             activeTab === 'liked' ? 'border-black text-black' : 'border-transparent text-gray-500'
//           }`}
//           onClick={() => onTabChange('liked')}
//         >
//           <Heart className="w-4 h-4" />
//           <span className="text-xs uppercase font-semibold">Liked</span>
//         </button>
//       </div>
//     </div>
//   );
// };