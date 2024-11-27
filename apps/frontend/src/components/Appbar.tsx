import { Avatar } from "./PostCard"
import { Link } from "react-router-dom"

export const Appbar = () => {
    return <div className = "max-w-2xl mx-auto flex flex-col justify-center pl-12">
        <div className="flex flex-col cursor-pointer pt-10 pl-4"> 
            <Link to={'/post'}>
                    SportStolt
            </Link>
        </div>
        <div className = "pt-12">
            <Link to={`/post`} className = "pt-8">
                <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">See Post</button>
            </Link>
        </div>
        <div className = "pt-2">
            <Link to={`/addpost`} className = "pt-8">
                <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New Post</button>
            </Link>
        </div>
        <div className = "pt-2">
            <Link to={`/addstory`} className = "pt-8">
                <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New Story</button>
            </Link>
        </div>
        
        <div className = "flex flex-row pt-12"> 
            {/* <Link to={`/profile`}>      */}
                <Avatar size={"big"} name="Vansh" />
                <div className = "flex flex-col justify-center pl-2">
                    Profile
                </div>
            {/* </Link> */}
        </div>
    </div>
}



{/* return <div> 
        <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto pt-6 px-4">
            <Story />
            <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800">Main Content</h2>
            <p className="text-gray-600 mt-2">Your feed content goes here...</p>
            </div>
        </div>
        </div> */}