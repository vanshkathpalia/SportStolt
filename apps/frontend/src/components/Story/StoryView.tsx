
"use client"
//this  is on opeing of a story

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import { ChevronUp, ChevronLeft, ChevronRight, X, Users, Clock, MapPin } from "lucide-react"
import type { StoryType } from "./types"
import { BACKEND_URL } from "../../config"

interface StoryViewProps {
  story: StoryType
  onClose: () => void
}

export const StoryView: React.FC<StoryViewProps> = ({ story, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [willAttend, setWillAttend] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const images = story.Storyimages
    ? story.Storyimages
    : story.Storyimages
      ? [story.Storyimages]
      : [{ url: story.locationImage, userId: story.author.userId || "0" }]

  const handleNext = useCallback(() => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1)
    }
  }, [currentImageIndex, images.length])

  const handlePrevious = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1)
    }
  }, [currentImageIndex])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext()
      } else if (event.key === "ArrowLeft") {
        handlePrevious()
      } else if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentImageIndex, handleNext, handlePrevious, onClose])

  const handleWillGo = async (selectedImageId: number) => {
    try {
      setError(null)

      // Get the token from localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        setError("You need to be logged in to attend this event")
        return
      }

      // Fix the URL (remove double slash)
      const response = await fetch(`${BACKEND_URL}/api/v1/story/will-go`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the authorization header
        },
        body: JSON.stringify({
          storyImageId: selectedImageId, // Use exact key "storyImageId"
          userId: Number(story.author.userId),
          storyId: story.id, // Include storyId if available
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to register attendance")
      }

      const data = await response.json()
      console.log("Response:", data)
      setWillAttend(true)
    } catch (error) {
      console.error("Error saving attendance:", error)
      setError(error instanceof Error ? error.message : "Failed to register attendance")
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative h-full">
        {/* Main Story Image */}
        {Array.isArray(images) && (
          <img
            src={images[Math.max(0, Math.min(currentImageIndex, images.length - 1))].url || "/placeholder.svg"}
            alt={`${story.sport} at ${story.location}`}
            className={`w-full h-full object-contain transition-all duration-300 ${
              showDetails ? "blur-sm brightness-50" : ""
            }`}
          />
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-4 rounded-full bg-black/30 hover:bg-black/50 z-50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2">
          {images.map((_, index: number) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-4 left-0 right-0 pl-4 pt-2">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              {story.author.image ? (
                <img
                  src={story.author.image || "/placeholder.svg"}
                  alt={story.author.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-400" />
              )}
            </div>
            <div className="text-white">
              <p className="font-semibold">{story.author.username}</p>
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
          <div className="absolute bottom-8 w-full flex justify-center">
            <button
              onClick={() => setShowDetails(true)}
              className="text-white flex flex-col items-center animate-bounce"
            >
              <ChevronUp className="w-6 h-6" />
              <span className="text-sm">Swipe up for details</span>
            </button>
          </div>
        )}

        {/* Details Modal */}
        {showDetails && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 rounded-t-xl backdrop-blur-sm">
            <div
              className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 cursor-pointer"
              onClick={() => setShowDetails(false)}
            ></div>

            <h3 className="text-white text-lg font-bold mb-2">{story.sport}</h3>
            <p className="text-white/80 text-sm mb-4">{story.description}</p>

            <div className="space-y-3">
              <div className="flex items-center text-white/90">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{story.location}</span>
              </div>
              <div className="flex items-center text-white/90">
                <Clock className="h-4 w-4 mr-2" />
                <span>{/* {story.activityStarted} - {story.activityEnded} */}</span>
              </div>
              <div className="flex items-center text-white/90">
                <Users className="h-4 w-4 mr-2" />
                {/* <span>{story.participants} participants</span> */}
              </div>
            </div>

            {/* Error message */}
            {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}

            {/* Will You Go Button */}
            {!willAttend ? (
              Array.isArray(story.Storyimages) && story.Storyimages.length > 0 ? (
                <button
                  onClick={() => {
                    const image = story.Storyimages?.[currentImageIndex];
                    if (image) {
                      handleWillGo(image.id);
                    } else {
                      console.warn("Image not found.");
                    }
                  }}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Yes, I will go!
                </button>
              ) : null
            ) : (
              <p className="mt-6 text-green-400">You have confirmed attendance!</p>
            )}

            <button onClick={() => setShowDetails(false)} className="mt-4 pl-4 text-white/90 hover:text-white">
              Close Details
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

