import { Appbar } from "../components/Appbar"
import { PostCard } from "../components/PostCard"
import { PostSkeleton } from "../components/PostSkeleton";
import { Story } from "../components/Story";
import { StorySkeleton } from "../components/StorySkeleton";
import { usePosts } from "../hooks";

export const Posts = () => {
    const { loading, posts } = usePosts();

    if (loading) {
        return <div className="flex flex-row">
            <div className = "pt-6 px-4 min-w-96" >
                <Appbar />
            </div>
            <div className="flex justify-center">
                <div>
                    <div className = "pt-6 px-4">
                        <StorySkeleton />
                    </div>
                    <div>
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                    </div>       
                </div>
            </div>
        </div>
    }

    else {
        return <div className = "flex flex-row">
            <div className = "pt-6 px-4 min-w-96" >
                <Appbar />
            </div>
            
            <div className="flex justify-center">
                <div>
                    <div className="pt-6 px-4">
                        <Story />
                    </div>
                    <div className="p-8">
                        {posts.map(post => <PostCard
                            id={post.id}
                            authorName={post.author.name || "Anonymous"}
                            title={post.title}
                            content={post.content}
                            publishedDate={"date"} />)}
                    </div>
                </div>
            </div>
        </div>
    }
}

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

// import React from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';

interface PostProps {
  username: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  likes: number;
  timestamp: string;
  loading?: boolean;
}

export function Post({ 
  username, 
  userAvatar, 
  imageUrl, 
  caption, 
  likes, 
  timestamp, 
  loading = false 
}: PostProps) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg mb-4 animate-pulse">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded" />
        </div>
        <div className="aspect-square bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="w-6 h-6 bg-gray-200 rounded" />
              <div className="w-6 h-6 bg-gray-200 rounded" />
              <div className="w-6 h-6 bg-gray-200 rounded" />
            </div>
            <div className="w-6 h-6 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={userAvatar} 
            alt={username} 
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium">{username}</span>
        </div>
        <button className="text-gray-600 hover:text-gray-900">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>
      
      <img 
        src={imageUrl} 
        alt="Post content" 
        className="w-full aspect-square object-cover"
      />
      
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="text-gray-600 hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>
        
        <div className="font-medium">{likes.toLocaleString()} likes</div>
        
        <div className="space-y-2">
          <p>
            <span className="font-medium mr-2">{username}</span>
            {caption}
          </p>
          <p className="text-gray-500 text-sm">{timestamp}</p>
        </div>
      </div>
    </div>
  );
}