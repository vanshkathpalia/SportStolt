"use client"

import { useEffect, useState } from "react"
import { useMediaQuery } from "../hooks/useMediaQuery"
// import { PlusCircle } from "lucide-react"
// import { usePosts } from "../../hooks/usePosts";

// const { posts, loading } = usePosts("recent"); // or "popular", "trending" etc.

import { Button } from "../components/ui/button"
import { MobileNav } from "../components/StickyBars/MobileNav"
import { Sidebar } from "../components/StickyBars/Sidebar"
import { useEvents } from "../hooks"
// import { StoryList } from "../components/Story/Storylist"
import { PostList } from "../components/Post/PostList"
import { EventHomeSidebar } from "../components/Event/EventHomeSidebar"
// import { PostSkeleton } from "../components/Post/PostSkeleton"
import { CreateStoryModal } from "../components/models/CreateStoryModal"
import { useNavigate } from "react-router-dom"
import { StoryList } from "../components/Story/StoryList"
// import { usePosts } from "../hooks/usePost"


interface PostsPageProps {
  openCreateModal: () => void
}

export const PostsPage = ({ openCreateModal }: PostsPageProps) => {
  const navigate = useNavigate()
  // const [storyDisplayType, setStoryDisplayType] = useState<"location" | "sport">("location")
  // const [postSortType, setPostSortType] = useState<"following" | "sport">("following")
  const [createStoryModalOpen, setCreateStoryModalOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  // const { loading, posts } = usePosts(postSortType)
  const { events } = useEvents()

  // const reversedPosts = [...posts].reverse();

  // When user clicks back
  // useEffect(() => {
  //   // Push dummy state so back triggers popstate event
  //   window.history.pushState(null, "", window.location.href);

  //   const onPopState = () => {
  //     const leave = window.confirm("Do you want to close this page?");
  //     if (leave) {
  //       window.close(); // This will close the tab because it was opened by JS
  //     } else {
  //       // User canceled, so push state again to prevent accidental close
  //       window.history.pushState(null, "", window.location.href);
  //     }
  //   };

  //   window.addEventListener("popstate", onPopState);
  //   return () => {
  //     window.removeEventListener("popstate", onPopState);
  //   };
  // }, []);

  useEffect(() => {
    const handlePopState = () => {
      // Push the user back to current URL silently
      window.history.pushState(null, "", window.location.pathname);
    };

    // Push initial state
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []); 


  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    // Close modal if you use one
    setShowLogoutConfirm(false);

    // Close this tab/window (only works if opened by JS)
    window.close();
  };


  const handleStayLoggedIn = () => {
    setShowLogoutConfirm(false)
    // Push the same state again to prevent back navigation
    window.history.pushState(null, "", window.location.href)
  }


  return (
    <div className="min-h-screen bg-background">
      {isMobile && <MobileNav openCreateModal={openCreateModal} />}

      <div className="flex">
        <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
          <Sidebar openCreateModal={openCreateModal} />
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-16 xl:ml-56">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Stories and Posts Column */}
              <div className="md:col-span-3 lg:col-span-3">
                {/* Story Display Type Toggle */}

                {/* Stories Section */}
                <div className="pt-2">
                  {/* <StorySession storyDisplayType={storyDisplayType} /> */}
                  <StoryList />
                </div>

                {/* Posts Section */}
                <PostList />

              </div>

              {/* Sidebar Events */}
              <div className="hidden lg:block lg:col-span-2">
                <EventHomeSidebar events={events} onRegister={() => navigate("/events")} />
              </div>
            </div>
          </div>
        </main>

        {/* Create Story Modal */}
        <CreateStoryModal
          isOpen={createStoryModalOpen}
          onClose={() => setCreateStoryModalOpen(false)}
        />
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowLogoutConfirm(false)} // clicking backdrop closes modal
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md max-w-sm w-full"
            onClick={(e) => e.stopPropagation()} // prevent closing modal on content click
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Are you sure you want to logout?
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Press Logout to leave the site or Stay Logged In to remain here.
            </p>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={handleStayLoggedIn}>
                Stay Logged In
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


