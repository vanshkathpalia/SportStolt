// import { Post } from "../../hooks"
// import { Sidebar } from "../StickyBars/Sidebar"
// import { CaptionLimit } from "../WordLimit";
// import { CommentCard } from "../Comment/CommentCard";
// // import { Avatar } from "./PostCard"
// import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
// // import { Appbar } from "../StickyBars/Appbar";

// export const FullPost = ({ post }: {post: Post}) => {
//     return <div  className="grid grid-cols-8 lg:grid-cols-10">
//         <div className="col-span-1">
//             <Sidebar openCreateModal={() => {}} />
//         </div>

//         {/* if comment click on, sm:hidden for this */}
//         <div className="md:col-span-6 lg:col-span-5 sm:col-span-6">
//             <div className="">
//             <div className="justify-center pt-4 col-span-6 col-start-2 pl-10">
//                 <div className="bg-white border border-gray-200 rounded-lg col-span-4">
//                     <div className="p-4 flex items-center justify-between">
//                         <div className="flex items-center justify-center space-x-3">
//                             {/* <div><Avatar name={post.author.name} size="big"/></div> */}
//                             <div>{post.author.name}</div>
//                         </div>
//                         <button className="text-gray-600 hover:text-gray-900">
//                             <MoreHorizontal className="w-6 h-6" />
//                         </button>
//                     </div>
//                         <div className="flex justify-center">
//                             <img
//                                 src={post.content}
//                                 alt={post.title}
//                                 className="w-full max-w-2xl lg:h-1/2 aspect-square"
//                             />
//                         </div>
//                         <div className="p-4 space-y-3">
//                             <div className="flex justify-between items-center">
//                                 <div className="flex space-x-4">
//                                     <button className="text-gray-600 hover:text-red-500 transition-colors">
//                                         <Heart className="w-6 h-6" />
//                                     </button>
//                                     <button className="text-gray-600 hover:text-gray-900 transition-colors">
//                                         <MessageCircle className="w-6 h-6" />
//                                     </button>
//                                     <button className="text-gray-600 hover:text-gray-900 transition-colors">
//                                         <Share2 className="w-6 h-6" />
//                                     </button>
//                                 </div>
//                                 <button className="text-gray-600 hover:text-gray-900 transition-colors">
//                                     <Bookmark className="w-6 h-6" />
//                                 </button>
//                             </div>
//                         <div className="h-4">like count</div>
//                         <div className="h-4">comment count</div>
//                     </div>
//                 </div>
//             </div>
//             </div>
//         </div>
//         {/* comment start here, if comment click on then sm show in anther tab */}
//         <div className = "grid sm:col-span-6 md:col-span-6 md:col-start-2 sm:col-start-2 lg:col-span-4"> 
//             <div className="p-10">
//                 <div className="divide-y-2 divide-solid items-center grid grid-cols-1">
//                     <div className="flex min-w-full w-fit pb-3">
//                         <div className="flex flex-col items-center justify-center">
//                             {/* <div><Avatar name={post.author.username} size="small"/></div> */}
//                             <div className="font-bold">{post.author.username || "Anonymous"} </div> 
//                             <div className="p-2 text-slate-500">
//                                 <CaptionLimit caption={"porem ipsum dolor sit amet consectetur adipisicing elit. Animi ratione ullam quisquam rem provident fuga cumque fugit quidem voluptatum minus, ducimus expedita obcaecati deleniti perspiciatis reprehenderit nisi veniam, eveniet soluta"} />
//                             </div>
//                         </div>
//                     </div>
                    
//                     <div>
//                         <CommentCard post={post}/>
//                     </div>
//                 </div>
//             </div>
//         </div>
           
            
//     </div>
// }
//                 // {/* <div className="col-span-8">
//                 //     <div className="text-5xl font-extrabold">
//                 //         {post.title}
//                 //     </div>
//                 //     <div className="text-slate-500 pt-2">
//                 //         Post on 2nd December 2023
//                 //     </div>
//                 //     <div className="pt-4">
//                 //         {post.content}
//                 //     </div>
//                 // </div> */}
 