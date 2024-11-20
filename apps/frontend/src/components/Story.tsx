//design for the story, using story card

import { usePosts } from "../hooks";
import { Spinner } from "./Spinner";
import { StoryCard } from "./StoryCard";

export const Story = () => {
    const { loading, story } = usePosts();

    if (loading) {
        return <div>
            <Spinner />
        </div>
    }

    else {
        return <div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
                <div className="flex flex-row-reverse gap-4 overflow-x-auto pb-2 scrollbar-hidecursor-pointer" >
                {story.map(story => <StoryCard
                    id={story.id}
                    authorName={story.author.name || "Anonymous"}
                    isViewed={story.isViewed}
                    image={story.image}
                    location={story.location}
                    createdAt={"date"} />)}
                </div>
            </div>
        </div>
    }
}


