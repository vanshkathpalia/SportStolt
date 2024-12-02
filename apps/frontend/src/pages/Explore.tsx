import { useState, useEffect } from 'react';
import { ExploreGrid } from '../components/Explore/ExploreGrid';


export const Explore = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <ExploreGrid isLoading={isLoading} />
    </div>
  );
};