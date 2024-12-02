import React, { useState, useEffect } from 'react';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { ProfileTabs } from '../components/Profile/ProfileTabs';
import { ProfileGrid } from '../components/Profile/ProfileGrid';
import { Appbar } from '../components/StickyBars/Appbar';

export const Profile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return ( 
    <div className="flex flex-row"> 
        <div className = "pt-6 px-4 min-w-60" >
            <Appbar />
        </div>
        <div className="max-w-6xl mx-auto bg-white min-h-screen">
        <ProfileHeader isLoading={isLoading} />
        <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isLoading={isLoading}
        />
        <ProfileGrid isLoading={isLoading} />
        </div>
    </div>
  );
};