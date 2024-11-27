import { Link } from "react-router-dom";
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
import { CaptionLimit } from "./WordLimit";

interface PostCardProps {
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    id: number;
}

export const PostCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate
}: PostCardProps) => {
    return <Link to={`/post/${id}`}>
        <div className="flex flex-col">
                <div className="flex justify-center">
                    <div className="bg-white border border-gray-100 rounded-lg mb-4">
                        <div className="p-4 flex items-center justify-between space-x-[420px]">
                            <div className="flex items-center justify-center space-x-3">
                                <div><Avatar name={authorName} size="big"/></div>
                                <div className="w-36">{authorName}</div>
                            </div>
                            <button className="text-gray-600 hover:text-gray-900">
                                <MoreHorizontal className="w-6 h-6" />
                            </button>
                        </div>
                            <div className="justify-items-center">
                                <img
                                    src={content}
                                    alt={title}
                                    className="w-full max-w-2xl h-fit max-h-2xl aspect-square px-1"
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
                            <div className="">like count</div>
                            <div className="space-y-2">
                                <div className="flex flex-row">
                                    <div className=""> {authorName} -  </div> 
                                    <CaptionLimit caption={"title"}/>
                                </div>
                                <div className="">{publishedDate}/comment adding/input</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/* <div className="p-8 border-b border-slate-200 pb-4 hover:bg-gray-50 w-screen max-w-screen-md cursor-pointer">
            <div className="flex">
                <Avatar name={authorName} />
                <div className="font-extralight pl-2 text-sm flex justify-center flex-col">{authorName}</div>
                <div className="flex justify-center flex-col pl-2">
                    <Circle />
                </div>
                <div className="pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col">
                    {publishedDate}
                </div>
            </div>
            <div className="text-xl font-semibold pt-2">
                {title}
            </div>
            <div className="text-md font-thin">
                {content.slice(0, 100) + "..."}
            </div>
            <div className="text-slate-500 text-sm font-thin pt-4">
                {`${Math.ceil(content.length / 100)} minute(s) read`}
            </div>
        </div> */}
    </Link>
}

export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500">

    </div>
}

export function Avatar({ name, size = "small" }: { name: string, size?: "small" | "big" }) {
    return <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${size === "small" ? "w-6 h-6" : "w-10 h-10"}`}>
    <span className={`${size === "small" ? "text-xs" : "text-md"} font-extralight text-gray-600 dark:text-gray-300`}>
        {name[0]}
    </span>
</div>
}