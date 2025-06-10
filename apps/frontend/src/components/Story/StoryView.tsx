"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { ChevronUp, ChevronLeft, ChevronRight, X, Users, Clock, MapPin } from "lucide-react"
import type { StoryType } from "./types"
import { BACKEND_URL } from "../../config"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface StoryViewProps {
  story: StoryType
  onClose: () => void
  onImageViewed?: (storyId: number, imageId: number) => void
  markImageAsViewed: (storyId: number, imageId: number) => void
  viewedImages: number[] // ✅ Add this line
}

export const StoryView: React.FC<StoryViewProps> = ({ story, onClose, onImageViewed, markImageAsViewed }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [willAttend, setWillAttend] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const elapsedBeforePauseRef = useRef(0)
  const intervalStartRef = useRef(0)

  const images = Array.isArray(story.Storyimages) && story.Storyimages.length > 0
    ? story.Storyimages
    : [{ id: 0, url: story.locationImage || "/placeholder.svg", userId: story.author.userId }]

  const durationPerStory = 5000 // 5 seconds per story

  const currentImage = images[Math.max(0, Math.min(currentImageIndex, images.length - 1))]

  const handleNext = useCallback(() => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
      setProgress(0)
    } else {
      onClose()
    }
  }, [currentImageIndex, images.length, onClose])

  const handlePrevious = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
      setProgress(0)
    }
  }, [currentImageIndex])

  useEffect(() => {
    if (onImageViewed && currentImage) {
      onImageViewed(story.id, currentImage.id);
    }

    markImageAsViewed(story.id, currentImage.id)

  }, [currentImageIndex, story.id, currentImage, onImageViewed, markImageAsViewed]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showDetails) return
      if (event.key === "ArrowRight") handleNext()
      else if (event.key === "ArrowLeft") handlePrevious()
      else if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleNext, handlePrevious, onClose, showDetails])

  useEffect(() => {
    if (showDetails) {
      // Paused: clear timer, store elapsed so far
      if (intervalStartRef.current) {
        elapsedBeforePauseRef.current += Date.now() - intervalStartRef.current
        clearInterval(timerRef.current!)
        intervalStartRef.current = 0
      }
      return
    }

    // Resumed: mark interval start time
    intervalStartRef.current = Date.now()

    timerRef.current = setInterval(() => {
      const elapsed = elapsedBeforePauseRef.current + (Date.now() - intervalStartRef.current)
      const percentage = Math.min(100, (elapsed / durationPerStory) * 100)
      setProgress(percentage)

      if (percentage >= 100) {
        clearInterval(timerRef.current!)
        elapsedBeforePauseRef.current = 0
        intervalStartRef.current = 0
        handleNext()
      }
    }, 100)

    return () => {
      clearInterval(timerRef.current!)
    }
  }, [showDetails, durationPerStory, handleNext])

  // const startRef = useRef(0) // absolute start time of current story image display

  // useEffect(() => {
  //   if (showDetails) {
  //     // Pause timer: accumulate elapsed and clear interval
  //     if (startRef.current) {
  //       elapsedBeforePauseRef.current += Date.now() - startRef.current
  //       clearInterval(timerRef.current!)
  //       startRef.current = 0
  //     }
  //     return
  //   }

  //   // Resume or start timer
  //   startRef.current = Date.now() - elapsedBeforePauseRef.current

  //   timerRef.current = setInterval(() => {
  //     const elapsed = Date.now() - startRef.current
  //     const percentage = Math.min(100, (elapsed / durationPerStory) * 100)
  //     setProgress(percentage)
  //     if (percentage >= 100) {
  //       clearInterval(timerRef.current!)
  //       elapsedBeforePauseRef.current = 0
  //       startRef.current = 0
  //       handleNext()
  //     }
  //   }, 100)

  //   return () => {
  //     clearInterval(timerRef.current!)
  //     startRef.current = 0
  //   }
  // }, [durationPerStory, handleNext, showDetails])


  const handleWillGo = async (selectedImageId: number) => {
    try {
      setError(null)
      const token = localStorage.getItem("token")
      if (!token) {
        setError("You need to be logged in to attend this event.")
        return
      }

      const response = await fetch(`${BACKEND_URL}/api/v1/story/will-go`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storyImageId: selectedImageId,
          userId: Number(story.author.userId),
          storyId: story.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to register attendance")
      }

      await response.json()
      setWillAttend(true)
    } catch (error) {
      console.error("Error saving attendance:", error)
      setError(error instanceof Error ? error.message : "Failed to register attendance")
    }
  }

  const startTime = new Date(story.activityStarted)
  const endTime = new Date(story.activityEnded)

  const clickCountRef = useRef(0)
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Modified overlay click handler:
  // - If details shown, close them on any click.
  // - If click anywhere in bottom half of screen, show details.
  // - Else count clicks for double tap to close story.
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showDetails) {
      setShowDetails(false)
      return
    }

    const clickY = e.clientY
    const windowHeight = window.innerHeight

    if (clickY > windowHeight / 2 && story.swipeUpEnabled) {
      // Click in bottom half: open details
      setShowDetails(true)
      return
    }

    // Else: track clicks for double-tap to close
    clickCountRef.current += 1

    if (clickCountRef.current >= 2) {
      onClose()
    }

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div
        className="w-screen h-screen flex items-center justify-center"
        onClick={handleOverlayClick}
      >
        {/* Image */}
        <img
          src={currentImage.url || "/placeholder.svg"}
          alt={`${story.sport} at ${story.location}`}
          className={`w-full max-h-[85%] object-contain transition-all duration-300 ${
            showDetails ? "blur-sm brightness-50" : ""
          }`}
        />

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-50">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full overflow-hidden bg-white/30`}
            >
              <div
                className={`h-full bg-white transition-all duration-100 linear`}
                style={{
                  width: index < currentImageIndex ? "100%" :
                        index === currentImageIndex ? `${progress}%` :
                        "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-4 rounded-full bg-black/30 hover:bg-black/50 z-50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Author */}
        {/* <div className="absolute top-4 left-4 z-40">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
              {story.author.image ? (
                <img src={story.author.image} alt={story.author.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-400" />
              )}
            </div>
            <div className="text-white">
              <p className="font-semibold">{story.author.username}</p>
              <p className="text-sm opacity-80">{story.location}</p>
            </div>
          </div>
        </div> */}
        <div className="absolute top-4 left-4 z-40">
          <div className="flex dark:text-slate-200 items-center space-x-2">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={story.author.image}
                alt={story.author.username}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg?height=40&width=40';
                }}
              />
              <AvatarFallback>
                {story.author.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-white dark:text-slate-200">
              <p className="font-medium text-sm">{story.author.username}</p>
              <p className="text-xs opacity-80">{story.location}</p>
            </div>
          </div>
        </div>


        {/* Navigation */}
        {!showDetails && currentImageIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrevious()
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black/30 hover:bg-black/50 z-40"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {!showDetails && currentImageIndex < images.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black/30 hover:bg-black/50 z-40"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Swipe Up Button (still there for user hint) */}
        {story.swipeUpEnabled && !showDetails && (
          <div className="absolute bottom-8 w-full flex justify-center z-30 pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowDetails(true)
              }}
              className="text-white flex flex-col items-center animate-bounce pointer-events-auto"
            >
              <ChevronUp className="w-6 h-6" />
              <span className="text-sm">Swipe up for details</span>
            </button>
          </div>
        )}

        {/* Details Section */}
        {showDetails && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-gray-900/70 backdrop-blur-sm z-50 p-4"
            onClick={() => setShowDetails(false)} // clicking outside closes modal
          >
            <div
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()} // prevent closing on inside click
            >
              {/* Grab bar */}
              <div
                className="w-14 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6 cursor-pointer"
                onClick={() => {
                  intervalStartRef.current = Date.now();
                  setShowDetails(false);
                }}
              ></div>

              {/* Title */}
              <h3 className="text-gray-900 dark:text-white text-2xl font-semibold mb-3 text-center">
                {story.sport}
              </h3>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 text-base mb-6 leading-relaxed text-center">
                {story.description}
              </p>

              {/* Details list */}
              <div className="space-y-4 text-gray-800 dark:text-gray-200 text-base">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  <span>{story.stadium}, {story.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  <span>
                    {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                    {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  <span>{story.participants} participants</span>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-5 text-red-500 text-sm font-medium text-center">{error}</div>
              )}

              {/* Attendance button / confirmation */}
              <div className="mt-8 flex flex-col items-center space-y-4">
                {!willAttend ? (
                  currentImage?.id && (
                    <button
                      onClick={() => handleWillGo(currentImage.id)}
                      className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 text-white font-semibold py-3 rounded-lg transition-all"
                    >
                      Yes, I will go!
                    </button>
                  )
                ) : (
                  <p className="text-green-500 font-semibold text-center">
                    You have confirmed attendance!
                  </p>
                )}

                {/* Close button */}
                <button
                  onClick={() => {
                    // intervalStartRef.current = Date.now()
                    setShowDetails(false);
                  }}
                  className="w-full max-w-xs bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 dark:focus:ring-gray-600 text-gray-900 dark:text-gray-200 font-semibold py-3 rounded-lg transition-all"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default StoryView