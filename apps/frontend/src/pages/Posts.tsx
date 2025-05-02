"use client"

import { useState } from "react"

// import { StoryList } from "../components/stories/StoryList"
import { useMediaQuery } from "../hooks/useMediaQuery"
import { PlusCircle } from "lucide-react"
import { Button } from "../components/ui/button"
// import { CreateStoryModal } from "../components/modals/CreateStoryModel"

// Mock data
// import { STORIES, POSTS, EVENTS } from "../data/mockData"
import { MobileNav } from "../components/StickyBars/MobileNav"
import { Sidebar } from "../components/StickyBars/Sidebar"
import { useEvents, usePosts } from "../hooks"
// import { EventCardHome } from "../components/Event/EventCardHome"
import { PostCard } from "../components/Post/PostCard"
// import { StorySkeleton } from "../components/Story/StorySkeleton"
// import { PostSkeleton } from "../components/Post/PostSkeleton"
import { Story } from "../components/Story/Story"
import { EventHomeSidebar } from "../components/Event/EventHomeSidebar"
import { PostSkeleton } from "../components/Post/PostSkeleton"
import { CreateStoryModal } from "../components/models/CreateStoryModal"
// import { Appbar } from "../components/StickyBars/Appbar"
// import { EventHomeSidebar } from "../components/Event/EventHomeSidebar"


// import { EventCardHome } from "../components/Event/EventCardHome"

interface PostsPageProps {
  openCreateModal: () => void
}

export const PostsPage = ({ openCreateModal }: PostsPageProps) => {
  const { loading, posts } = usePosts();
  const { events } = useEvents();
  const [storyDisplayType, setStoryDisplayType] = useState<"sport" | "location">("sport")
  const [postSortType, setPostSortType] = useState<"following" | "sport">("following")
  // const [selectedSportFilter, setSelectedSportFilter] = useState<string | null>(null)
  const [createStoryModalOpen, setCreateStoryModalOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Extract all unique sport tags for filtering
  // const allSportTags = Array.from(new Set(POSTS.flatMap((post) => post.sportTags || [])))

  // Filter posts based on selected sport tag
//   const filteredPosts = selectedSportFilter
//     ? POSTS.filter((post) => post.sportTags?.includes(selectedSportFilter))
//     : POSTS

//   useEffect(() => {
//     // Simulate loading data
//     const timer = setTimeout(() => {
//       setLoading(false)
//     }, 1000)

//     return () => clearTimeout(timer)
//   }, [])

    //  if (loading) {
    //     return <div className="flex flex-row">
    //         <div className = "pt-6 px-4" >
    //             <Sidebar openCreateModal={openCreateModal} />
    //         </div> 
    //         <div>
    //           <div className="grid grid-cols-9 p-2">
    //               <div className="px-1 md:px-4 mt-2">
    //                     <StorySkeleton />
    //                 </div>
    //                 <div className="col-start-2 sm:col-span-5 sm:col-start-3 p-4 xl:col-start-2">
    //                     <PostSkeleton />
    //                     <PostSkeleton />
    //                     <PostSkeleton />
    //                     <PostSkeleton />
    //                     <PostSkeleton />
    //                 </div>       
    //             </div>
    //         </div>
    //     </div>
    // }
    // else {
      return <div className="min-h-screen bg-background">
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
              <div className="md:col-span-3 p-2 lg:col-span-3">
                {/* Story Display Type Toggle */}
                <div className="mt-2 md:mt-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setStoryDisplayType("sport")} //hangleStoryType -> setting type and also sending request to backend for sorting according to sport
                      className={`px-3 py-1 text-sm rounded-full ${
                        storyDisplayType === "sport"
                          ? "bg-blue-400 text-white"  
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      Sports
                    </button>
                    <button
                      onClick={() => setStoryDisplayType("location")} //hangleStoryType -> setting type and also sending request to backend for sorting according to location
                      className={`px-3 py-1 text-sm rounded-full ${
                        storyDisplayType === "location" ? "bg-blue-400 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      Locations
                    </button>
                  </div>

                  {/* Create Post Button (Desktop) */}
                  <Button
                    onClick={openCreateModal}
                    size="sm"
                    className="hidden md:flex items-center gap-1 bg-primary hover:bg-blue-300 text-primary-foreground"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create Post
                  </Button>
                </div>

                {/* Stories Section */}
                  <div className="pt-2 ">
                    <Story />
                  </div>
                  <hr />

                {/* Post Sorting Options */}
                <div className="mt-4 mb-2">
                  <div className="flex justify-between items-center ">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setPostSortType("following") //hanglePostType -> setting type and also sending request to backend for sorting according to following 
                          // setSelectedSportFilter(null)
                        }}
                        className={`px-3 py-1 text-sm rounded-full ${
                          postSortType === "following"
                            ? "bg-blue-400 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        Following
                      </button>
                      <button
                        onClick={() => setPostSortType("sport")} //hanglePostType -> setting type and also sending request to backend for sorting according to sport - or this should be handled on frontend only 
                        className={`px-3 py-1 text-sm rounded-full ${
                          postSortType === "sport" ? "bg-blue-400 text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        Sports
                      </button>
                    </div>
                  </div>
                </div>

                  {/* Sport Tags Filter - Only visible when "Sports" is selected */}
                  {/* {postSortType === "sport" && (
                    <div className="flex flex-wrap gap-2 mt-2 pb-2 overflow-x-auto">
                      {allSportTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedSportFilter(tag === selectedSportFilter ? null : tag)}
                          className={`px-3 py-1 text-xs rounded-full border ${
                            tag === selectedSportFilter
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-background text-foreground border-border"
                          }`}
                        >
                          {tag}
                        </button>
                    ))}
                    </div>
                  )}  */}
                {/* </div> */}

                {/* Posts Section */}
                <div className="mt-2 px-6 pt-6 space-y-4 md:px-4 pb-16 md:pb-8">
                  {loading
                    ? // Post loading skeletons
                      Array(3)
                        .fill(0)
                        .map((_, index) => <PostSkeleton key={index} />)
                    : // Actual posts
                      posts.length === 0 ? (
                        <p className="text-center text-muted-foreground py-10">No posts available right now</p> // Message when no posts are available
                      ) : (
                        posts.map((post) => (
                          <PostCard
                            key={post.id}
                            id={post.id}
                            author={post.author.name || "Anonymous"}
                            title={post.title}
                            content={post.content}
                            expanded={false}
                          />
                        ))
                      )}
                </div>

            
              </div>
              
                <div className="hidden lg:block lg:col-span-2 ">
                  
                          <EventHomeSidebar
                            events={events}
                            onRegister={() => alert('Registration functionality coming soon!')}
                          />
                      
                </div>

            </div>
          </div>
        </main>
      {/* Create Story Modal */}
      <CreateStoryModal isOpen={createStoryModalOpen} onClose={() => setCreateStoryModalOpen(false)} />
      </div>
    </div>
  }


      

// import { PostCard } from "../components/Post/PostCard"
// import { PostSkeleton } from "../components/Post/PostSkeleton";
// import { Story } from "../components/Story/Story";
// import { EventCardHome } from '../components/Event/EventCardHome';
// import { StorySkeleton } from "../components/Story/StorySkeleton";
// import { useEvents, usePosts } from "../hooks";
// // import { Sidebar } from "../components/StickyBars/Sidebar";
// import { Calendar} from "lucide-react";
// import { Appbar } from "../components/StickyBars/Appbar";

// export const PostsPage = () => {
//     const { loading, posts } = usePosts();
//     const {events} = useEvents();

//     if (loading) {
//         return <div className="flex flex-row">
//             {/* <div className = "pt-6 px-4" >
//                 <Sidebar />
//             </div> */}
//             <div>
//               <div className="grid grid-cols-9 p-2">
//                   <div className="px-1 md:px-4 mt-2">
//                         <StorySkeleton />
//                     </div>
//                     <div className="col-start-2 sm:col-span-5 sm:col-start-3 p-4 xl:col-start-2">
//                         <PostSkeleton />
//                         <PostSkeleton />
//                         <PostSkeleton />
//                         <PostSkeleton />
//                         <PostSkeleton />
//                     </div>       
//                 </div>
//             </div>
//         </div>
//     }

//     else {
//         return <div className = "flex flex-row">
//             <div className = "pt-6 px-4" >
//                 <Appbar />
//             </div>
            
//             {/* <div>
//                 <div className="grid grid-cols-9 p-2">

//                   <div className="px-1 md:px-4 mt-2">
//                     <Story />
//                   </div>
                    
//                   <div className="sm:col-span-5 sm:col-start-3 p-4 xl:col-start-2">
//                       {posts.map(post => <PostCard
//                           id={post.id}
//                           authorName={post.author.name || "Anonymous"}
//                           title={post.title}
//                           content={post.content}
//                           publishedDate={"date"} />)}
//                   </div>

//                   <div className="col-start-7 col-span-3 hidden xl:block p-10">
                    
//                     <Calendar className="h-8 w-6 mb-10" />
                      

//                     <div className="scroll-pt-24 overflow-auto pb-2 h-[600px]">
//                       {events.map(event => (
//                         <EventCardHome
//                           event={event}
//                           onRegister={() => alert('Registration functionality coming soon!')}
//                         />
//                       ))}
//                     </div>
                       
//                   </div>
//                 </div>
//             </div> */}
//         </div>
//     }
// }

// .map(Post => <PostCard
//     id={Post.id}
//     authorName={Post.author.name || "Anonymous"}
//     title={Post.title}
//     content={Post.content}
//     publishedDate={"2nd Feb 2024"}

// {/* <div className="flex justify-center">
//                 <div>
//                     <Avatar name="vansh" />
//                     <div className="font-extralight pl-2 text-sm flex justify-center flex-col">vansh</div>
//                     <div className="flex justify-center flex-col pl-2">
//                         <Circle />
//                     </div>
//                     <div className="pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col">
//                         10 nov
//                     </div>
//                 </div>
//                 <div className="text-xl font-semibold pt-2">
//                     this is the ittle 
//                 </div>
//                 </div>
//             </div> */}


/* for image skeleton
<div role="status" class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
    <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
  </svg>
    <span class="sr-only">Loading...</span>
</div> */

// // import React from 'react';
// import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
// import { Sidebar } from "../components/StickyBars/Sidebar";
// import { EventCard } from "../components/Event/EventCard";

// interface PostProps {
//   username: string;
//   userAvatar: string;
//   imageUrl: string;
//   caption: string;
//   likes: number;
//   timestamp: string;
//   loading?: boolean;
// }

// export function Post({ 
//   username, 
//   userAvatar, 
//   imageUrl, 
//   caption, 
//   likes, 
//   timestamp, 
//   loading = false 
// }: PostProps) {
//   if (loading) {
//     return (
//       <div className="bg-white border border-gray-200 rounded-lg mb-4 animate-pulse">
//         <div className="p-4 flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gray-200 rounded-full" />
//             <div className="h-4 w-24 bg-gray-200 rounded" />
//           </div>
//           <div className="w-6 h-6 bg-gray-200 rounded" />
//         </div>
//         <div className="aspect-square bg-gray-200" />
//         <div className="p-4 space-y-3">
//           <div className="flex justify-between items-center">
//             <div className="flex space-x-4">
//               <div className="w-6 h-6 bg-gray-200 rounded" />
//               <div className="w-6 h-6 bg-gray-200 rounded" />
//               <div className="w-6 h-6 bg-gray-200 rounded" />
//             </div>
//             <div className="w-6 h-6 bg-gray-200 rounded" />
//           </div>
//           <div className="h-4 w-20 bg-gray-200 rounded" />
//           <div className="space-y-2">
//             <div className="h-4 w-3/4 bg-gray-200 rounded" />
//             <div className="h-4 w-1/2 bg-gray-200 rounded" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white border border-gray-200 rounded-lg mb-4">
//       <div className="p-4 flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <img 
//             src={userAvatar} 
//             alt={username} 
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <span className="font-medium">{username}</span>
//         </div>
//         <button className="text-gray-600 hover:text-gray-900">
//           <MoreHorizontal className="w-6 h-6" />
//         </button>
//       </div>
      
//       <img 
//         src={imageUrl} 
//         alt="Post content" 
//         className="w-full aspect-square object-cover"
//       />
      
//       <div className="p-4 space-y-3">
//         <div className="flex justify-between items-center">
//           <div className="flex space-x-4">
//             <button className="text-gray-600 hover:text-red-500 transition-colors">
//               <Heart className="w-6 h-6" />
//             </button>
//             <button className="text-gray-600 hover:text-gray-900 transition-colors">
//               <MessageCircle className="w-6 h-6" />
//             </button>
//             <button className="text-gray-600 hover:text-gray-900 transition-colors">
//               <Share2 className="w-6 h-6" />
//             </button>
//           </div>
//           <button className="text-gray-600 hover:text-gray-900 transition-colors">
//             <Bookmark className="w-6 h-6" />
//           </button>
//         </div>
        
//         <div className="font-medium">{likes.toLocaleString()} likes</div>
        
//         <div className="space-y-2">
//           <p>
//             <span className="font-medium mr-2">{username}</span>
//             {caption}
//           </p>
//           <p className="text-gray-500 text-sm">{timestamp}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
