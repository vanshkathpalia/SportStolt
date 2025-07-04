"use client"

import { useNavigate, useParams } from "react-router-dom"
import { usePost } from "../hooks";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { MobileNav } from "../components/StickyBars/MobileNav";
import { Sidebar } from "../components/StickyBars/Sidebar";
import { Button } from "../components/ui/button";
import { ArrowLeft, Bookmark, Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { PostCard } from "../components/Post/PostCard";

interface PostPageProps {
  openCreateModal: () => void
}

export const PostPage = ({ openCreateModal }: PostPageProps) => {
  const { id } = useParams();
    const {loading, post} = usePost({
        id: id || ""
    });
  const isMobile = useMediaQuery("(max-width: 768px)")
  const navigate = useNavigate()


  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header - Only visible on mobile */}
      {isMobile && <MobileNav openCreateModal={openCreateModal} />}

      <div className="flex">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden md:block w-16 lg:w-64 fixed h-screen">
          <Sidebar openCreateModal={openCreateModal} />
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-16 lg:ml-64bg-background">
          <div className="max-w-2xl mx-auto p-4">
            {/* Back button */}
            <Button variant="ghost" size="sm" className="mb-4 flex items-center gap-1 dark:text-white" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {loading ? (
              // Loading skeleton
              // <div className="bg-white dark:bg-gray-800 rounded-md p-8 mb-20 space-y-4 max-w-xl mx-auto">
              //   <div className="flex items-center dark:border-gray-900 kspace-x-2">
              //     <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse" />
              //     <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 animate-pulse" />
              //   </div>
              //   <div className="w-full aspect-square bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              //   <div className="space-y-2">
              //     <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32 animate-pulse" />
              //     <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse" />
              //   </div>
              // </div>
              // PostSkeleton()
              <div className="flex justify-center">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 animate-pulse w-full max-w-xl">
                  {/* Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <MoreHorizontal className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Image Placeholder */}
                  <div className="h-[600px] bg-gray-200 dark:bg-gray-700 w-full" />

                  {/* Bottom Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4">
                        <button className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className="w-6 h-6" />
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <MessageCircle className="w-6 h-6" />
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <Share2 className="w-6 h-6" />
                        </button>
                      </div>
                      <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <Bookmark className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Skeleton Texts */}
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                </div>
              </div>

            ) : post ? (
              // Post detail view
                  <div className="sm:col-span-5 sm:col-start-3 p-3xl:col-start-2">
                      {post &&  <PostCard
                          id={post.id}
                          author={post.author}
                          title={post.title}
                          content={post.content}
                          createdAt={post.createdAt}
                        //   publishedDate={"date"} 
                        expanded={true}  />}
                  </div>
            ) : (
              // Post not found
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">Post not found</h2>
                <p className="text-muted-foreground mb-4">
                  The post you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={handleBack}>Go back</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}


/* user profile on comment 


<button data-popover-target="popover-user-profile" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">User profile</button>

<div data-popover id="popover-user-profile" role="tooltip" class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600">
    <div class="p-3">
        <div class="flex items-center justify-between mb-2">
            <a href="#">
                <img class="w-10 h-10 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Jese Leos">
            </a>
            <div>
                <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Follow</button>
            </div>
        </div>
        <p class="text-base font-semibold leading-none text-gray-900 dark:text-white">
            <a href="#">Jese Leos</a>
        </p>
        <p class="mb-3 text-sm font-normal">
            <a href="#" class="hover:underline">@jeseleos</a>
        </p>
        <p class="mb-4 text-sm">Open-source contributor. Building <a href="#" class="text-blue-600 dark:text-blue-500 hover:underline">flowbite.com</a>.</p>
        <ul class="flex text-sm">
            <li class="me-2">
                <a href="#" class="hover:underline">
                    <span class="font-semibold text-gray-900 dark:text-white">799</span>
                    <span>Following</span>
                </a>
            </li>
            <li>
                <a href="#" class="hover:underline">
                    <span class="font-semibold text-gray-900 dark:text-white">3,758</span>
                    <span>Followers</span>
                </a>
            </li>
        </ul>
    </div>
    <div data-popper-arrow></div>
</div>

*/
  

/* when looking for one post only... with multiple photo 
this is  in row with the comment tailwind componenet


<div id="controls-carousel" class="relative w-full" data-carousel="static">
    <!-- Carousel wrapper -->
    <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
         <!-- Item 1 -->
        <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/docs/images/carousel/carousel-1.svg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>
        <!-- Item 2 -->
        <div class="hidden duration-700 ease-in-out" data-carousel-item="active">
            <img src="/docs/images/carousel/carousel-2.svg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>
        <!-- Item 3 -->
        <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/docs/images/carousel/carousel-3.svg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>
        <!-- Item 4 -->
        <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/docs/images/carousel/carousel-4.svg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>
        <!-- Item 5 -->
        <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/docs/images/carousel/carousel-5.svg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>
    </div>
    <!-- Slider controls -->
    <button type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
            <span class="sr-only">Previous</span>
        </span>
    </button>
    <button type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span class="sr-only">Next</span>
        </span>
    </button>
</div>
 */


/* for post having videos 
<video class="w-full" autoplay controls>
  <source src="/docs/videos/flowbite.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> */