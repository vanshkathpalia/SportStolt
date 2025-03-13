import React from 'react';
import { Grid, Bookmark, Heart } from 'lucide-react';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isLoading?: boolean;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange, isLoading }) => {
  if (isLoading) {
    return (
      <div className="border-t m-1 border-gray-200">
        <div className="flex justify-around">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 w-24 bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  /* ontabchange is chaning the usestate in the profile, for then checking its type in here, we have to fetch diff data for each... */
  return (
    <div className="border-t border-gray-200">
      <div className="flex justify-around">
        <button
          className={`flex items-center gap-2 px-4 py-3 border-t-2 ${
            activeTab === 'posts' ? 'border-black text-black' : 'border-transparent text-gray-500'
          }`}
          onClick={() => onTabChange('posts')}
        >
          <Grid className="w-4 h-4" />
          <span className="text-xs uppercase font-semibold">Posts</span>
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-3 border-t-2 ${
            activeTab === 'saved' ? 'border-black text-black' : 'border-transparent text-gray-500'
          }`}
          onClick={() => onTabChange('saved')}
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-xs uppercase font-semibold">Saved</span>
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-3 border-t-2 ${
            activeTab === 'liked' ? 'border-black text-black' : 'border-transparent text-gray-500'
          }`}
          onClick={() => onTabChange('liked')}
        >
          <Heart className="w-4 h-4" />
          <span className="text-xs uppercase font-semibold">Liked</span>
        </button>
      </div>
    </div>
  );
};