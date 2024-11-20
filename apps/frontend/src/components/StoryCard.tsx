
interface Story {
    image: string;
    isViewed?: boolean;
    location: string;
    id: number;
    authorName: string;
    createdAt: string;
}


export function StoryCard({
    image, 
    location, 
    isViewed
  }: Story) {
    return (
      <div className="flex flex-col items-center hover:bg-gray-100 justify-center gap-1">
        <div className={`p-[2px] rounded-full ${isViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 to-pink-600'}`}>
          <div className="bg-white p-[2px] rounded-full">
            <img
              src={image}
              alt={location}
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>
        </div>
        <span className="text-xs truncate w-16 text-center">{location}</span>
      </div>
    );
  }
  
  {/* <div className={`p-[2px] rounded-full ${isViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 to-pink-600'}`}></div> */}