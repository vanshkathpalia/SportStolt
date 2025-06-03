import { useContext } from "react";
import { WatchedStoriesContext } from "./WatchedStoriesContext";

export const useWatchedStories = () => {
  const context = useContext(WatchedStoriesContext);
  if (!context) throw new Error('useWatchedStories must be used within a WatchedStoriesProvider');
  return context;
};