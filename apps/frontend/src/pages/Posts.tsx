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
            <div className = "max-w-3xl pt-6 px-4" >
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
            <div className = "pt-6 px-4 basic-1/2" >
                <Appbar />
            </div>
            
            <div className="flex justify-center">
                <div>
                    <div className="max-w-7xl pt-6 px-4">
                        <Story />
                    </div>
                    <div>
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