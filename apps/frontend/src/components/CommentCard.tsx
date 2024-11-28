
import { Avatar } from "./PostCard"
import { CommentLimit } from "./WordLimit";
import { Post } from "../hooks"
import CommentBox from "./AddComment";

export const CommentCard = ({post}: {post: Post} ) => {
    return <div>
        <div className="pt-2 pb-5">
            <div className="flex flex-row">
                <div><Avatar name={"Anonymous"} size="big"/></div>
                <CommentBox />
                {/* send this input */}
            </div>
        </div>
        <div className="flex flex-col scroll-pt-24 overflow-auto h-96 pb-2 max-w-3xl"> 
            <div className="flex flex-row pb-6">
                <div><Avatar name={"aAnonymous"} size="big"/></div>
                <div className="font-bold px-2">{"Anonymous"} 
                    <div className=" text-slate-500">
                        <CommentLimit comment={"orem ipsum dolor sit amet consectetur adipisicing elit. Animi ratione ullam quisquam rem provident fuga cumque fugit quidem voluptatum minus, ducimus expedita obcaecati deleniti perspiciatis reprehenderit nisi veniam, eveniet soluta."}
                        />
                    </div>
                </div> 
            </div>

            <div className="flex flex-row pb-6">
                <div><Avatar name={"aAnonymous"} size="big"/></div>
                <div className="font-bold px-2">{"Anonymous"} 
                    <div className=" text-slate-500">
                        <CommentLimit comment={post.title} />
                    </div>
                </div> 
            </div>

            <div className="flex flex-row pb-6">
                <div><Avatar name={"aAnonymous"} size="big"/></div>
                <div className="font-bold px-2">{"Anonymous"} 
                    <div className=" text-slate-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi ratione ullam quisquam rem provident fuga cumque fugit quidem voluptatum minus, ducimus expedita obcaecati deleniti perspiciatis reprehenderit nisi veniam, eveniet soluta.
                    </div>
                </div> 
            </div>


            <div className="flex flex-row pb-6">
                <div><Avatar name={"aAnonymous"} size="big"/></div>
                <div className="font-bold px-2">{"Anonymous"} 
                    <div className=" text-slate-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi ratione ullam quisquam rem provident fuga cumque fugit quidem voluptatum minus, ducimus expedita obcaecati deleniti perspiciatis reprehenderit nisi veniam, eveniet soluta.
                    </div>
                </div> 
            </div>


            <div className="flex flex-row pb-6">
                <div><Avatar name={"aAnonymous"} size="big"/></div>
                <div className="font-bold px-2">{"Anonymous"} 
                    <div className=" text-slate-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi ratione ullam quisquam rem provident fuga cumque fugit quidem voluptatum minus, ducimus expedita obcaecati deleniti perspiciatis reprehenderit nisi veniam, eveniet soluta.
                    </div>
                </div> 
            </div>


            <div className="flex flex-row pb-6">
                <div><Avatar name={"aAnonymous"} size="big"/></div>
                <div className="font-bold px-2">{"Anonymous"} 
                    <div className=" text-slate-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi ratione ullam quisquam rem provident fuga cumque fugit quidem voluptatum minus, ducimus expedita obcaecati deleniti perspiciatis reprehenderit nisi veniam, eveniet soluta.
                    </div>
                </div> 
            </div>


            <div className="flex flex-row pb-6">
                <div><Avatar name={"aAnonymous"} size="big"/></div>
                <div className="font-bold px-2">{"Anonymous"} 
                    <div className=" text-slate-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi ratione ullam quisquam rem provident fuga cumque fugit quidem voluptatum minus, ducimus expedita obcaecati deleniti perspiciatis reprehenderit nisi veniam, eveniet soluta.
                    </div>
                </div> 
            </div>

            <div className="flex flex-row">
                <div><Avatar name={"aAnonymous"} size="big"/></div>
                <div className="font-bold px-2">{"Anonymous"} 
                    <div className=" text-slate-500 divide-y-2 divide-solid">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi ratione ullam quisquam rem provident fuga cumque fugit quidem voluptatum minus, ducimus expedita obcaecati deleniti perspiciatis reprehenderit nisi veniam, eveniet soluta.
                    </div>
                </div> 
                
            </div>

            <div className="flex flex-row">
                <div><Avatar name={"aAnonymous"} size="big"/></div>
                <div className="font-bold px-2">{"Anonymous"} 
                    <div className=" text-slate-500 divide-y-2 divide-solid">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi ratione ullam quisquam rem provident fuga cumque fugit quidem voluptatum minus, ducimus expedita obcaecati deleniti perspiciatis reprehenderit nisi veniam, eveniet soluta.
                    </div>
                </div> 
                
            </div>

            <div className="flex flex-row">
                <div><Avatar name={"aAnonymous"} size="big"/></div>
                <div className="font-bold px-2">{"Anonymous"} 
                    <div className=" text-slate-500 divide-y-2 divide-solid">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi ratione ullam quisquam rem provident fuga cumque fugit quidem voluptatum minus, ducimus expedita obcaecati deleniti perspiciatis reprehenderit nisi veniam, eveniet soluta.
                    </div>
                </div> 
                
            </div>
            
        </div>
       
    </div>
}

export default CommentCard


// <div><Avatar name={post.author.name || "aAnonymous"} size="big"/></div>
//             <div className="font-bold p-2">{post.author.name || "Anonymous"} </div> 
//             <div className="p-2 text-slate-500">{post.content || "random comment"}</div> 