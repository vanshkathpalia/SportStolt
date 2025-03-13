import React, { useState, useEffect } from 'react';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { ProfileTabs } from '../components/Profile/ProfileTabs';
import { ProfileGrid } from '../components/Profile/ProfileGrid';
// import { Appbar } from '../components/StickyBars/Appbar';
import { Sidebar } from '../components/StickyBars/Sidebar';

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
    <div className="grid grid-cols-8 col-span-3"> 
        <div className = "pt-6 px-4 col-span-1" >
            <Sidebar />
        </div>
        
            <div className="mx-auto bg-white min-h-screen col-span-6">
            <ProfileHeader isLoading={isLoading} />
            <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isLoading={isLoading}
            />
            <ProfileGrid isLoading={isLoading} />
        </div>

        </div>
        
    </div>
  );
};