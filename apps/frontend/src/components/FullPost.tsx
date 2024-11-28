import { Post } from "../hooks"
import { Appbar } from "./Appbar"
import { CaptionLimit } from "./WordLimit";
import { CommentCard } from "./CommentCard";
import { Avatar } from "./PostCard"
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';

export const FullPost = ({ post }: {post: Post}) => {
    return <div className = "flex flex-row">
        <div className = "pt-6 px-4 min-w-60" >
            <Appbar />
        </div>

        <div className="flex flex-col py-8 max-w-2xl">
            <div className="flex justify-center">
                <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 flex items-center justify-between space-x-96">
                        <div className="flex items-center justify-center space-x-3">
                            <div><Avatar name={post.author.name} size="big"/></div>
                            <div>{post.author.name}</div>
                        </div>
                        <button className="text-gray-600 hover:text-gray-900">
                            <MoreHorizontal className="w-6 h-6" />
                        </button>
                    </div>
                        <div className="min-2xl justify-items-center">
                            <img
                                src={post.content}
                                alt={post.title}
                                className="w-full max-w-2xl aspect-square"
                            />
                        </div>
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
                        <div className="h-4">like count</div>
                        <div className="h-4">comment count</div>
                    </div>
                </div>
            </div>
        </div>
        {/* comment start here */}
        <div className = "w-1/2">
            <div className="p-10">
                <div className="divide-y-2 divide-solid items-center">
                    <div className="flex min-w-full w-fit pb-3 items-center justify-center">
                        <div className="flex flex-col items-center justify-center">
                            <div><Avatar name={post.author.name} size="big"/></div>
                            <div className="font-bold">{post.author.name || "Anonymous"} </div> 
                            <div className="p-2 text-slate-500">
                                <CaptionLimit caption={"porem ipsum dolor sit amet consectetur adipisicing elit. Animi ratione ullam quisquam rem provident fuga cumque fugit quidem voluptatum minus, ducimus expedita obcaecati deleniti perspiciatis reprehenderit nisi veniam, eveniet soluta"} />
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <CommentCard post={post}/>
                    </div>
                </div>
            </div>
        </div>
           
            
    </div>
}
                // {/* <div className="col-span-8">
                //     <div className="text-5xl font-extrabold">
                //         {post.title}
                //     </div>
                //     <div className="text-slate-500 pt-2">
                //         Post on 2nd December 2023
                //     </div>
                //     <div className="pt-4">
                //         {post.content}
                //     </div>
                // </div> */}
 