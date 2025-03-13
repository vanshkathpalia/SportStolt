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
        src="https://img.freepik.com/free-photo/positive-male-youngster-with-curly-hair_176532-8174.jpg?t=st=1733119110~exp=1733122710~hmac=87e8b61f003f99824d8bcc61eacb5ed744bb9833ac46390e3894c3af6c76b11d&w=2000"
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
      />
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-xl font-semibold">vansh_</h1>
          <button className="px-4 py-1.5 bg-gray-100 rounded-md text-sm font-medium">
            Edit Profile
          </button>
          <Settings className="w-6 h-6 text-gray-600 cursor-pointer" />
        </div>
        
        <div className="flex gap-8 mb-4 justify-center md:justify-start">
          <div className="text-center">
            <span className="font-semibold">6</span>
            <span className="text-gray-500 text-sm block">Posts</span>
          </div>
          <div className="text-center">
            <span className="font-semibold">22</span>
            <span className="text-gray-500 text-sm block">Stories</span>
          </div>
          <div className="text-center">
            <span className="font-semibold">97%</span>
            <span className="text-gray-500 text-sm block">Reputation</span>
          </div>
        </div>
        
        <div className="text-sm">
          <p className="font-semibold">Vansh Kumar</p>
          <p className="text-gray-600">Location | University </p>
        </div>
      </div>
    </div>
  );
};