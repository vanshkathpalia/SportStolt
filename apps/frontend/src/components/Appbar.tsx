import { Avatar } from "./PostCard"
import { Link } from "react-router-dom"
import { Story } from "./Story"

export const Appbar = () => {
    return <div className="border-b flex flex-row justify-between px-10 py-4">
        <Link to={'/post'} className="flex flex-col justify-center cursor-pointer">
                SportStolt
        </Link>
        <div>
            <Story />
        </div>
        <div>
            <Link to={`/posting`}>
                <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New Post</button>
            </Link>
            <Link to={`/publish`}>
                <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New Story</button>
            </Link>
            <Avatar size={"big"} name="Vansh" />
            <div>
            
            </div>
        </div>
    </div>
}
