import { Heart, MessageCircle } from "lucide-react"
import { Link } from "react-router-dom"

interface FullViewProps {
    post: string,
    index: number
}

export const FullView = ({
    post, 
    index
}: FullViewProps) => {
    return <Link to={`/apipost/${index}`}>
        <div key={index} className="relative group aspect-square">
          <img
            src={post}
            alt={`Post ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-6 text-white">
              <div className="flex items-center gap-1">
                <Heart className="w-6 h-6" />
                <span className="font-semibold">2.5k</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-6 h-6" />
                <span className="font-semibold">124</span>
              </div>
            </div>
          </div>
        </div>
    </Link>
}