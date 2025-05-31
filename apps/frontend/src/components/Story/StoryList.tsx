import React, { useState, useEffect } from "react";
import { StoryCard } from "./StoryCard";
import { StorySkeleton } from "./StorySkeleton";
import { CreateStoryModal } from "../models/CreateStoryModal";
import { useStories } from "../../hooks/useStories";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../config";

export const StoryList: React.FC = () => {
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [filterBy, setFilterBy] = useState<'location' | 'sport' | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [userPreferences, setUserPreferences] = useState<{
    preferredLocations: string[];
    preferredSports: string[];
  } | null>(null);
  const navigate = useNavigate();

  const { loading, story } = useStories(filterBy);

  // Fetch user preferences when component mounts
  useEffect(() => {
    const fetchPreferences = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/settings/preferences`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserPreferences(response.data.preferences);
      } catch (err) {
        console.error('Failed to load preferences:', err);
      }
    };

    fetchPreferences();
  }, []);

  const handleFilterChange = (newFilter: 'location' | 'sport' | null) => {
    // If trying to filter by location but no location preferences set
    if (newFilter === 'location' && (!userPreferences?.preferredLocations || userPreferences.preferredLocations.length === 0)) {
      setShowAlert(true);
      return;
    }
    
    // If trying to filter by sport but no sport preferences set
    if (newFilter === 'sport' && (!userPreferences?.preferredSports || userPreferences.preferredSports.length === 0)) {
      setShowAlert(true);
      return;
    }

    // If we have preferences for the selected filter, update it
    setFilterBy(newFilter);
  };

  const handleAlertConfirm = () => {
    setShowAlert(false);
    navigate("/settings");
  };

  const openCreateStoryModal = () => setIsCreateStoryModalOpen(true);
  const closeCreateStoryModal = () => setIsCreateStoryModalOpen(false);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto w-screen pb-2 max-w-full">
        <StorySkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-2">
      {/* Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Preferences Not Set
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {filterBy === 'location' 
                ? "Please set your preferred locations in settings to filter stories by location."
                : "Please set your preferred sports in settings to filter stories by sport."}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAlert(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAlertConfirm}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Settings
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => handleFilterChange("location")}
          className={`px-4 py-2 text-sm rounded-full transition ${
            filterBy === "location"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Location
        </button>
        <button
          onClick={() => handleFilterChange("sport")}
          className={`px-4 py-2 text-sm rounded-full transition ${
            filterBy === "sport"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Sport
        </button>
        {filterBy && (
          <button
            onClick={() => setFilterBy(null)}
            className="px-4 py-2 text-sm rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="bg-background gap-4 flex justify-center">
        <div className="pt-2 scroll-pr-24 gap-4 overflow-x-auto w-screen pb-2 max-w-full flex flex-row">
          {/* Add Story Button */}
          <div
            className="flex flex-col items-center justify-center gap-1 cursor-pointer"
            onClick={openCreateStoryModal}
          >
            <div className="p-[2px] rounded-full bg-gray-300 dark:bg-gray-300 relative">
              <div className="bg-white p-[2px] dark:bg-gray-200 rounded-full flex items-center justify-center w-14 h-14">
                <span className="text-2xl font-bold text-gray-500">+</span>
              </div>
            </div>
            <span className="text-xs truncate w-16 text-center text-gray-400">Add Story</span>
          </div>

          <CreateStoryModal isOpen={isCreateStoryModalOpen} onClose={closeCreateStoryModal} />

          {/* Render stories */}
          {story.length > 0 ? (
            story.map((storyItem) => (
              <StoryCard
                key={storyItem.id}
                story={{
                  id: storyItem.id,
                  locationImage: storyItem.locationImage,
                  location: storyItem.location,
                  description: storyItem.description,
                  participants: storyItem.participants,
                  createdAt: storyItem.createdAt,
                  image: storyItem.locationImage,
                  activityEnded: storyItem.activityEnded,
                  activityStarted: storyItem.activityStarted,
                  sport: storyItem.sport,
                  endTime: storyItem.endTime,
                  author: storyItem.author,
                  Storyimages: storyItem.Storyimages,
                  isViewed: storyItem.isViewed,
                  swipeUpEnabled: storyItem.swipeUpEnabled,
                  authenticityStatus: storyItem.authenticityStatus,
                }}
                onClose={() => console.log('Story card closed')}
                filterBy={filterBy}
              />
            ))
          ) : (
            <div className="flex items-center dark:text-slate-400 justify-center pb-4 w-full">
              <p>
                {filterBy 
                  ? `No stories available for your preferred ${filterBy === 'location' ? 'locations' : 'sports'}`
                  : "No stories available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};