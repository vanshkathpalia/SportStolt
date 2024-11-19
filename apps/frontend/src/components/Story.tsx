//design for the story, using story card

import { Appbar } from "./Appbar"

import { usePosts } from "../hooks";
import { StoryCard } from "./storyCard";

export const Story = () => {
    const { loading, story } = usePosts();

    if (loading) {
        return <div>
            
        </div>
    }

    else {
        return <div>
            <Appbar />
            <div className="flex justify-center">
                <div>
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