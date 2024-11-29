import React from 'react';
import { Settings } from 'lucide-react';

interface ProfileHeaderProps {
  isLoading?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row items-center gap-8 p-8">
        <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-xl font-semibold">Vansh</h1>
            <button className="px-4 py-1.5 bg-gray-100 rounded-md text-sm font-medium">
              Edit Profile
            </button>
            <Settings className="w-6 h-6 text-gray-600 cursor-pointer" />
          </div>
          <div className="flex gap-6 justify-center md:justify-start">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-1" />
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-72 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 p-8">
      <img
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
      />
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-xl font-semibold">john_doe</h1>
          <button className="px-4 py-1.5 bg-gray-100 rounded-md text-sm font-medium">
            Edit Profile
          </button>
          <Settings className="w-6 h-6 text-gray-600 cursor-pointer" />
        </div>
        
        <div className="flex gap-8 mb-4 justify-center md:justify-start">
          <div className="text-center">
            <span className="font-semibold">542</span>
            <span className="text-gray-500 text-sm block">posts</span>
          </div>
          <div className="text-center">
            <span className="font-semibold">22.5k</span>
            <span className="text-gray-500 text-sm block">followers</span>
          </div>
          <div className="text-center">
            <span className="font-semibold">128</span>
            <span className="text-gray-500 text-sm block">following</span>
          </div>
        </div>
        
        <div className="text-sm">
          <p className="font-semibold">John Doe</p>
          <p className="text-gray-600">Digital creator | Photography enthusiast </p>
          <p className="text-gray-600">Capturing moments one click at a time </p>
        </div>
      </div>
    </div>
  );
};