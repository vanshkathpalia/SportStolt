"use client"
// useEffect

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { MessageCircle, Send, MoreHorizontal, Heart, Bookmark } from "lucide-react"
import { cn } from "../../lib/utils"
import axios from "axios"
import { BACKEND_URL } from '../../config';

// interface Comment {
//   id: number
//   username: string
//   content: string
// }

export interface Post {
  id: number
  author: {
    name: string
    image:string
    username: string
    // avatar: string
  }
//   imageUrl: string
  title: string
  content: string
//   likes: number
//   sportTags?: string[]
//   comments: Comment[]
//   publishedDate: string
  expanded: boolean
}

interface PostCardProps {
    title: string;
    content: string;
    id: number;
    author: {
      image: string; username:string; name: string
    };
    expanded: boolean;
}
export const PostCard = ({
    id,
    title,
    content,
    author,
    expanded
}: PostCardProps) => {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(0);
  //   const [showAllComments, setShowAllComments] = useState(expanded)

  const userToken = localStorage.getItem("token") || "";

  // useEffect(() => {
  //   fetch(`${BACKEND_URL}/api/v1/post/${id}/status`, {
  //     headers: { Authorization: `Bearer ${userToken}` }
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       setLiked(data.liked);
  //       setSaved(data.saved);
  //       setLikeCount(data.likeCount);
  //     });
  // }, [id]);

  const navigate = useNavigate()

  // const handleLike = async () => {
  //   setLiked(!liked)
  //   try {
  //     await axios.post(`/api/posts/${id}/like`, {}, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`, || "", // Adjust token source
  //       }
  //     })
  //   } catch (error) {
  //     console.error("Failed to like:", error)
  //     setLiked(!liked) // rollback
  //   }
  // }

  const handleSave = async () => {
    setSaved(!saved)
    try {
      await axios.post(`/api/post/${id}/save`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}, || ""`
        }
      })
    } catch (error) {
      console.error("Failed to save:", error)
      setSaved(!saved) // rollback
    }
  }

//   Get initials for avatar fallback
//   const authorInitials = post.author.name.charAt(0).toUpperCase()

//   const handleLike = () => {
//     setLiked(!liked)
//   }

//   const handleSave = () => {
//     setSaved(!saved)
//   }

  const handlePostClick = () => {
    if (!expanded) {
      navigate(`/post/${id}`)
    }
  }

  return (
    <div
      className={cn(
        "bg-background bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md max-w-xl mx-auto mb-5", 
        // !expanded && "cursor-pointer"
      )} onClick={handlePostClick}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-3" onClick={handlePostClick}>
        <div className="flex dark:text-slate-200 items-center space-x-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={author.image} alt={title} />
            {/* <AvatarFallback>{authorInitials}</AvatarFallback> */}
          </Avatar>
          <span className="font-medium dark:text-slate-200 text-sm">{author.username}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 dark:text-slate-200">
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">More options</span>
        </Button>
      </div>

      {/* Post Image */}
      <div className="relative aspect-square" >
        <img src={content || "/placeholder.svg"} alt={title} className="dark:text-slate-200 w-full h-full object-cover" />
      </div>

      {/* Post Actions */}
      <div className="p-3">
      <div className={cn("font-medium dark:text-slate-200 text-sm mb-1 p-1")}>{likeCount} {likeCount === 1 ? "like" : likeCount === 0 ? "like" : "likes"}</div>

        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                fetch(`${BACKEND_URL}/api/v1/post/${id}/like`, {
                  method: "POST",
                  headers: { Authorization: `Bearer ${userToken}` },
                })
                  .then(res => res.json())
                  .then(data => {
                    setLiked(data.liked);
                    setLikeCount(data.likeCount);
                  })
                  .catch(() => {
                    setLiked(prev => !prev);
                  });
              }}
              className={cn(
                "text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors",
                liked && "text-red-500"
              )}
            >
              <Heart className={cn("w-6 h-6", liked && "fill-red-500")} />
              <span className="sr-only">Like</span>
            </button>

            <button
              onClick={() => {
                // Comment logic here if needed
              }}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="sr-only">Comment</span>
            </button>

            <button
              onClick={() => {
                // Share logic here if needed
              }}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Send className="w-6 h-6" />
              <span className="sr-only">Share</span>
            </button>
          </div>

          <button
            onClick={handleSave}
            className={cn(
              "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors",
              saved && "text-primary"
            )}
          >
            <Bookmark className={cn("w-6 h-6", saved && "fill-current")} />
            <span className="sr-only">Save</span>
          </button>
        </div>


        {/* Sport Tags */}
        {/* {post.sportTags && post.sportTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.sportTags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )} */}

        {/* Likes */}
        {/* <div className="font-medium text-sm mb-1">{liked ? post.likes + 1 : post.likes} likes</div> */}

        {/* Caption */}
        {/* <div className="text-sm mb-1">
          <span className="font-medium mr-1">{post.author.name}</span>
          {post.content}
        </div> */}

        {/* Comments */}
        {/* {post.comments.length > 0 && (
          <div className="mt-1">
            {!showAllComments && post.comments.length > 2 && (
              <button className="text-muted-foreground text-sm mb-1" onClick={() => setShowAllComments(true)}>
                View all {post.comments.length} comments
              </button>
            )}

            {(showAllComments ? post.comments : post.comments.slice(0, 2)).map((comment) => (
              <div key={comment.id} className="text-sm mb-1">
                <span className="font-medium mr-1">{comment.username}</span>
                {comment.content}
              </div>
            ))}
          </div>
        )} */}

        {/* Timestamp */}
        {/* <div className="text-xs text-muted-foreground mt-1">{post.publishedDate}</div> */}

        {/* Add Comment Section - Only visible in expanded view */}
        {/* {expanded && (
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <Button variant="ghost" size="sm" className="text-blue-500 font-medium">
                Post
              </Button>
            </div>
          </div> 
        )} */}
      </div>
    </div>
  )
}


export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500">

    </div>
}

// export function Avatar({ name, size = "small" }: { name: string, size?: "small" | "big" }) {
//     return <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${size === "small" ? "w-6 h-6" : "w-10 h-10"}`}>
//     <span className={`${size === "small" ? "text-xs" : "text-md"} font-extralight text-gray-600 dark:text-gray-300`}>
//         {name[0]}
//     </span>
// </div>
// }

// const ImageWithFallback = ({
//     title,
//     content,
//     fallback
// }: { title: string; content: string; fallback: string }) => {
//     const [currentSrc, setCurrentSrc] = useState(content);

//     return (
//         <img
//             src={currentSrc}
//             alt={title}
//             className="w-auto max-w-[550px] max-h-2xl h-fit max-h-2xl aspect-square px-1"
//             onError={() => setCurrentSrc(fallback)} 
//         />
//     );
// }


// "use client"

// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
// import { Button } from "../ui/button"
// import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"
// import { cn } from "../../lib/utils"

// // interface Comment {
// //   id: number
// //   username: string
// //   content: string
// // }

// export interface Post {
//   id: number
// //   author: {
// //     name: string
// //     // avatar: string
// //   }
// //   imageUrl: string
//   title: string
//   content: string
// //   likes: number
// //   sportTags?: string[]
// //   comments: Comment[]
// //   publishedDate: string
// }

// interface PostCardProps {
//     id: number
//     // author: {
//     //     name: string
//     // }
//     title: string
//     content: string
// //   expanded?: boolean
// }

// export function PostCard({ post, expanded = false }: PostCardProps) {
// //   const [liked, setLiked] = useState(false)
// //   const [saved, setSaved] = useState(false)
// //   const [showAllComments, setShowAllComments] = useState(expanded)
//   const navigate = useNavigate()

//   // Get initials for avatar fallback
//   const authorInitials = post.author.name.charAt(0).toUpperCase()

// //   const handleLike = () => {
// //     setLiked(!liked)
// //   }

// //   const handleSave = () => {
// //     setSaved(!saved)
// //   }

//   const handlePostClick = () => {
//     if (!expanded) {
//       navigate(`/post/${post.id}`)
//     }
//   }

//   return (
//     <div
//       className={cn(
//         "bg-background border border-border rounded-md max-w-xl mx-auto mb-6",
//         !expanded && "cursor-pointer",
//       )}
//     >
//       {/* Post Header */}
//       <div className="flex items-center justify-between p-3">
//         <div className="flex items-center space-x-2">
//           <Avatar className="w-8 h-8">
//             <AvatarImage src={post.content} alt={post.title} />
//             <AvatarFallback>{authorInitials}</AvatarFallback>
//           </Avatar>
//           <span className="font-medium text-sm">something</span>
//         </div>
//         <Button variant="ghost" size="icon" className="h-8 w-8">
//           <MoreHorizontal className="h-5 w-5" />
//           <span className="sr-only">More options</span>
//         </Button>
//       </div>

//       {/* Post Image */}
//       <div className="relative aspect-square" onClick={handlePostClick}>
//         <img src={post.content || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
//       </div>

//       {/* Post Actions */}
//       <div className="p-3">
//         <div className="flex items-center justify-between mb-2">
//           <div className="flex items-center space-x-4">
//             {/* <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLike}>
//               <Heart className={cn("h-6 w-6", liked && "fill-red-500 text-red-500")} />
//               <span className="sr-only">Like</span>
//             </Button> */}
//             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePostClick}>
//               <MessageCircle className="h-6 w-6" />
//               <span className="sr-only">Comment</span>
//             </Button>
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <Send className="h-6 w-6" />
//               <span className="sr-only">Share</span>
//             </Button>
//           </div>
//           {/* <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSave}>
//             <Bookmark className={cn("h-6 w-6", saved && "fill-current")} />
//             <span className="sr-only">Save</span>
//           </Button> */}
//         </div>

//         {/* Sport Tags */}
//         {/* {post.sportTags && post.sportTags.length > 0 && (
//           <div className="flex flex-wrap gap-1 mb-2">
//             {post.sportTags.map((tag) => (
//               <span
//                 key={tag}
//                 className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         )} */}

//         {/* Likes */}
//         {/* <div className="font-medium text-sm mb-1">{liked ? post.likes + 1 : post.likes} likes</div> */}

//         {/* Caption */}
//         {/* <div className="text-sm mb-1">
//           <span className="font-medium mr-1">{post.author.name}</span>
//           {post.content}
//         </div> */}

//         {/* Comments */}
//         {/* {post.comments.length > 0 && (
//           <div className="mt-1">
//             {!showAllComments && post.comments.length > 2 && (
//               <button className="text-muted-foreground text-sm mb-1" onClick={() => setShowAllComments(true)}>
//                 View all {post.comments.length} comments
//               </button>
//             )}

//             {(showAllComments ? post.comments : post.comments.slice(0, 2)).map((comment) => (
//               <div key={comment.id} className="text-sm mb-1">
//                 <span className="font-medium mr-1">{comment.username}</span>
//                 {comment.content}
//               </div>
//             ))}
//           </div>
//         )} */}

//         {/* Timestamp */}
//         {/* <div className="text-xs text-muted-foreground mt-1">{post.publishedDate}</div> */}

//         {/* Add Comment Section - Only visible in expanded view */}
//         {/* {expanded && (
//           <div className="mt-4 pt-3 border-t border-border">
//             <div className="flex items-center">
//               <input
//                 type="text"
//                 placeholder="Add a comment..."
//                 className="flex-1 bg-transparent text-sm outline-none"
//               />
//               <Button variant="ghost" size="sm" className="text-blue-500 font-medium">
//                 Post
//               </Button>
//             </div>
//           </div> 
//         )} */}
//       </div>
//     </div>
//   )
// }


// import { Link } from "react-router-dom";
// import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
// import { CaptionLimit } from "../WordLimit";
// import { useState } from "react";

// interface PostCardProps {
//     authorName: string;
//     title: string;
//     content: string;
//     publishedDate: string;
//     id: number;
// }

// export const PostCard = ({
//     id,
//     authorName,
//     title,
//     content,
//     publishedDate
// }: PostCardProps) => {
//     return <Link to={`/post/${id}`}>
//         <div className="flex flex-col p-4">
//                 <div className="flex justify-center">
//                     <div className="bg-white border border-gray-100 rounded-lg mb-4 flex flex-col justify-center">
//                         <div className="p-4 flex items-center justify-between space-x-[300px]">
//                             <div className="flex items-center justify-center space-x-3">
//                                 <div><Avatar name={authorName} size="big"/></div>
//                                 <div className="w-36">{authorName}</div>
//                             </div>
//                             <button className="text-gray-600 hover:text-gray-900">
//                                 <MoreHorizontal className="w-6 h-6" />
//                             </button>
//                         </div>
//                             <div className="">
//                                 <div className="flex justify-center">
//                                 <ImageWithFallback
//                                     content={content}// The main image URL
//                                     title={title}
//                                     fallback="https://www.tributemedia.com/hs-fs/hub/481308/file-2535713272-jpg/CUsersNikkiDocumentsTributeMedia404Errors2.jpg?width=2560&name=CUsersNikkiDocumentsTributeMedia404Errors2.jpg" // Default image URL
//                                 />
//                                 </div>
//                             </div>
//                             <div className="p-4 space-y-3">
//                                 <div className="flex justify-between items-center">
//                                     <div className="flex space-x-4">
//                                         <button className="text-gray-600 hover:text-red-500 transition-colors">
//                                             <Heart className="w-6 h-6" />
//                                         </button>
//                                         <button className="text-gray-600 hover:text-gray-900 transition-colors">
//                                             <MessageCircle className="w-6 h-6" />
//                                         </button>
//                                         <button className="text-gray-600 hover:text-gray-900 transition-colors">
//                                             <Share2 className="w-6 h-6" />
//                                         </button>
//                                     </div>
//                                     <button className="text-gray-600 hover:text-gray-900 transition-colors">
//                                         <Bookmark className="w-6 h-6" />
//                                     </button>
//                                 </div>
//                             <div className="">like count</div>
//                             <div className="space-y-2">
//                                 <div className="flex flex-row">
//                                     <div className=""> {authorName} -  </div> 
//                                     <CaptionLimit caption={"title"}/>
//                                 </div>
//                                 <div className="">{publishedDate}/comment adding/input</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         {/* <div className="p-8 border-b border-slate-200 pb-4 hover:bg-gray-50 w-screen max-w-screen-md cursor-pointer">
//             <div className="flex">
//                 <Avatar name={authorName} />
//                 <div className="font-extralight pl-2 text-sm flex justify-center flex-col">{authorName}</div>
//                 <div className="flex justify-center flex-col pl-2">
//                     <Circle />
//                 </div>
//                 <div className="pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col">
//                     {publishedDate}
//                 </div>
//             </div>
//             <div className="text-xl font-semibold pt-2">
//                 {title}
//             </div>
//             <div className="text-md font-thin">
//                 {content.slice(0, 100) + "..."}
//             </div>
//             <div className="text-slate-500 text-sm font-thin pt-4">
//                 {`${Math.ceil(content.length / 100)} minute(s) read`}
//             </div>
//         </div> */}
//     </Link>
// }
