import { Appbar } from "../components/Appbar"
import { PostCard } from "../components/PostCard"
import { PostSkeleton } from "../components/PostSkeleton";
import { usePosts } from "../hooks";

export const Posts = () => {
    const { loading, posts } = usePosts();

    if (loading) {
        return <div>
            <Appbar /> 
            <div  className="flex justify-center">
                <div>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            </div>
        </div>
    }

    else {
        return <div>
            <Appbar />
            <div  className="flex justify-center">
                <div>
                    {posts.map(post => <PostCard
                        id={post.id}
                        authorName={post.author.name || "Anonymous"}
                        title={post.title}
                        content={post.content}
                        publishedDate={"date"}/>)}
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

