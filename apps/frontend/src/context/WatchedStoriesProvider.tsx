import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { WatchedStoriesContext, getWatchedImagesKey } from './WatchedStoriesContext';

type ViewedStoryImages = { [storyId: number]: number[] };

export const WatchedStoriesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [viewedStoryImages, setViewedStoryImages] = useState<ViewedStoryImages>({});

  useEffect(() => {
    if (typeof user?.id !== 'number') return;

    const timeout = setTimeout(() => {
      const key = getWatchedImagesKey(user.id);
      const saved = localStorage.getItem(key);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setViewedStoryImages(parsed);
        } catch {
          localStorage.removeItem(key);
          setViewedStoryImages({});
        }
      } else {
        setViewedStoryImages({});
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [user?.id]);

  const markImageAsViewed = (storyId: number, imageId: number) => {
    if (typeof user?.id !== 'number') return;

    setViewedStoryImages((prev) => {
      const imagesForStory = prev[storyId] || [];

      if (!imagesForStory.includes(imageId)) {
        const updatedImages = [...imagesForStory, imageId];
        const updated = { ...prev, [storyId]: updatedImages };

        const key = getWatchedImagesKey(user.id);
        localStorage.setItem(key, JSON.stringify(updated));

        return updated;
      }

      return prev;
    });
  };

  const isStoryFullyViewed = (story: { id: number; Storyimages?: { id: number }[] }) => {
    const viewedImages = viewedStoryImages[story.id] || [];
    return Array.isArray(story.Storyimages)
      ? story.Storyimages.every((img) => viewedImages.includes(img.id))
      : false;
  };

  return (
    <WatchedStoriesContext.Provider
      value={{ viewedStoryImages, markImageAsViewed, isStoryFullyViewed }}
    >
      {children}
    </WatchedStoriesContext.Provider>
  );
};

export default WatchedStoriesProvider;