import { useState } from "react";
import { PostCard } from "./PostCard";
import { PostSkeleton } from "./PostSkeleton";
import { usePosts } from "../../hooks/usePost";

// export const PostList => {
export const PostList: React.FC = () => {
    const [postSortType, setPostSortType] = useState<"user" | "tag" | "all">("all")
    // const [storyDisplayType, setStoryDisplayType] = useState<"location" | "sport" | "all">("all");
    const { loading, posts } = usePosts(postSortType)

    if (loading) {
        return (
            <>
            {Array(3)
                .fill(0)
                .map((_, index) => ( <PostSkeleton key={index} />
            ))}
            </> 
        )
    }

    if (posts.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-10">No posts available</p>;
    }

    return (
    <div className="pl-2">
        <div className="mt-4 mb-6"> 
            <div className="flex justify-between items-center">                     
                <div className="flex space-x-2">
                    <button
                    onClick={() => setPostSortType("user")}
                    className={`px-3 py-1 text-sm rounded-full transition ${
                        postSortType === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                    >
                    Users
                    </button>
                    <button
                    onClick={() => setPostSortType("tag")}
                    className={`px-3 py-1 text-sm rounded-full transition ${
                        postSortType === "tag"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                    >
                    Tags
                    </button>
                </div>
            </div>
        </div>
        <div className="space-y-12">
            {posts.map((post) => (
                <PostCard
                key={post.id}
                id={post.id}
                author={post.author}
                title={post.title}
                createdAt={post.createdAt}
                content={post.content}
                expanded={false}
                />
            ))}
        </div>
    </div>
  );
};
