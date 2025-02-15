import { useState } from 'react';
import { StoryView } from './StoryView';
import { useNavigate } from 'react-router-dom';

interface StoryCardProps {
    story: {
        id: number;
        locationImage: string;
        location: string;
        description?: string;
        activityStarted: Date;
        activityEnded: Date;
        eventLink?: string;
        createdAt: string;
        sport?: string;
        endTime: any;
        author: {
            name: string;
            image?: string;
            UserID: string;
        };
        Storyimages?: {
            UserID: number;
            url: string;
        }[];
        swipeUpEnabled?: boolean;
        authenticityStatus?: string;
        stadium?: string;
        isViewed?: boolean;
    };
    isViewed?: boolean;
    onClose: () => void;
}


const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
    
    const [isViewingStory, setIsViewingStory] = useState(false);
    const navigate = useNavigate();

    if (!story) {
        return (
            <div
                className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                onClick={() => navigate("/addstory")}
            >
                <div className="p-[2px] rounded-full bg-gray-300 relative">
                    <div className="bg-white p-[2px] rounded-full flex items-center justify-center w-14 h-14">
                        <span className="text-2xl font-bold text-gray-500">+</span>
                    </div>
                </div>
                <span className="text-xs truncate w-16 text-center text-gray-500">Add Story</span>
            </div>
        );
    }

    return (
        <>
            <div 
                className="flex flex-col items-center hover:bg-gray-100 justify-center gap-1 cursor-pointer"
                onClick={() => setIsViewingStory(true)}
            >
                <div className={`p-[2px] rounded-full ${story.isViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 to-pink-600'}`}>
                    <div className="bg-white p-[2px] rounded-full">
                        <img
                            src={story.locationImage}
                            alt={story.location}
                            className="w-14 h-14 rounded-full object-cover"
                        />
                    </div>
                </div>
                <span className="text-xs truncate w-16 text-center">{story.location}</span>
            </div>

            {isViewingStory && (
                <StoryView
                    story={{
                        id: story.id,
                        locationImage: story.locationImage,
                        image: story.locationImage,
                        location: story.location,
                        description: story.description,
                        eventLink: story.eventLink,
                        createdAt: story.createdAt,
                        sport: story.sport,
                        activityEnded: story.activityEnded,
                        activityStarted: story.activityStarted,
                        endTime: story.endTime,
                        authenticityStatus: story.authenticityStatus,
                        stadium: story.stadium,
                        swipeUpEnabled: story.swipeUpEnabled,
                        Storyimages: (story.Storyimages || []).map(image => ({
                            url: image?.url,
                            UserID: image?.UserID?.toString(),
                        })) || [],
                        author: {
                            name: story.author?.name || "Anonymous",
                            image: story.author?.image,
                            UserID: story.author?.UserID || ""
                        }
                    }}
                    onClose={() => setIsViewingStory(false)}
                />
            )}
        </>
    );
}


export default StoryCard;