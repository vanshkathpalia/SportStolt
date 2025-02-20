import { useCallback, useEffect, useState } from 'react';
import { ChevronUp, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { StoryType } from './types';
// import { BACKEND_URL } from '../../config';
// import axios from 'axios';

interface StoryViewProps {
  story: StoryType;
  onClose: () => void;
}

export const StoryView: React.FC<StoryViewProps> = ({ story, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const images = story.Storyimages ? story.Storyimages : (story.Storyimages ? [story.Storyimages] : [{ url: story.locationImage, UserID: story.author.UserID || '0' }]);

  const handleNext = useCallback(() => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  }, [currentImageIndex, images.length]);

  const handlePrevious = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  }, [currentImageIndex]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentImageIndex, handleNext, handlePrevious, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative h-full">
        {/* Main Image */}
        {Array.isArray(images) && (
          <img
            src={images[Math.max(0, Math.min(currentImageIndex, images.length - 1))].url}
            alt={`${story.sport} at ${story.location}`}
            className={`w-full h-full object-contain transition-all duration-300 ${
              showDetails ? 'blur-sm brightness-50' : ''
            }`}
          />
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/30 hover:bg-black/50 z-50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2">
          {images.map((_, index: number) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-4 left-0 right-0 px-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              {story.author.image ? (
                <img
                  src={story.author.image}
                  alt={story.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-400" />
              )}
            </div>
            <div className="text-white">
              <p className="font-semibold">{story.author.name}</p>
              <p className="text-sm opacity-80">{story.location}</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        {currentImageIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black/30 hover:bg-black/50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {currentImageIndex < images.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black/30 hover:bg-black/50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Swipe Up Button */}
        {story.swipeUpEnabled && !showDetails && (
          <button
            onClick={() => setShowDetails(true)}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center animate-bounce"
          >
            <ChevronUp className="w-6 h-6" />
            <span className="text-sm">Swipe up for details</span>
          </button>
        )}

        {/* Details Modal */}
        {showDetails && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/70 p-6 rounded-lg max-w-lg w-full mx-4">
              <h2 className="text-white text-2xl font-bold mb-4">{story.sport} at {story.stadium}</h2>
              <p className="text-white/90 mb-4">{story.description}</p>
              <div className="text-white/80 text-sm">
                <p><strong>Location:</strong> {story.location}</p>
                <p><strong>Activity Started At:</strong> {new Date(story.activityStarted).toLocaleString()}</p>
                <p><strong>Activity Will End At:</strong> {new Date(story.activityEnded).toLocaleString()}</p>
                <p><strong>Expires At:</strong> {new Date(story.endTime).toLocaleString()}</p>
                <p><strong>Posted:</strong> {new Date(story.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setShowDetails(false)} className="mt-4 text-white/90 hover:text-white">
                Close Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};