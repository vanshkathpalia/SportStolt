import { createContext } from 'react';

type ViewedStoryImages = { [storyId: number]: number[] };

interface WatchedStoriesContextType {
  viewedStoryImages: ViewedStoryImages;
  markImageAsViewed: (storyId: number, imageId: number) => void;
  isStoryFullyViewed: (story: { id: number; Storyimages?: { id: number }[] }) => boolean;
}

export const WatchedStoriesContext = createContext<WatchedStoriesContextType | undefined>(undefined);

export const getWatchedImagesKey = (userId: number) => `viewedStoryImages_user_${userId}`;

