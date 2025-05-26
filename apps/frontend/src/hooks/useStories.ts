import { useEffect, useState } from "react";
// import axios from "axios";
import { BACKEND_URL } from "../config"; // Adjust import path if needed

export interface Story {
    // story: {
        id: number;
        locationImage: string;
        location: string;
        description?: string;
        activityStarted: Date;
        activityEnded: Date;
        participants?: number;
        createdAt: string;
        sport?: string;
        endTime: Date;
        author: {
            username: string;
            image?: string;
            userId: string;
        };
        Storyimages?: {
            id: number;
            userId: string;
            url?: string;
        }[];
        swipeUpEnabled?: boolean;
        authenticityStatus?: string;
        stadium?: string;
        isViewed?: boolean;
    // };
    // isViewed?: boolean;
    onClose: () => void;
}

// export const useStories = (storyDisplayType = "default") => {
export const useStories = (groupBy: "location" | "sport" | "all") => {
    const [loading, setLoading] = useState(true);
    const [story, setStory] = useState<Story[]>([]);

    useEffect(() => {
        const fetchStories = async () => {
            const token = localStorage.getItem("token");
            console.log(token);
            try {
                const res = await fetch(`${BACKEND_URL}/api/v1/story/fetch?groupBy=${groupBy}`, {
                    headers: {
                        Authorization: token ?? "",
                    },
                });
                const data = await res.json();
                setStory(data.stories);
            } catch (error) {
                console.error("Failed to fetch stories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [groupBy]);

    return { loading, story };
};
