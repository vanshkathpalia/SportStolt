export interface StoryType {
    id: number;
    locationImage: string;
    // image: string;
    location: string;
    description?: string;
    activityStarted: Date;
    activityEnded: Date;
    participants?: number;
    createdAt: string;
    sport?: string;
    endTime: Date;
    author: {
        // name: string;
        username: string;
        image?: string;
        userId: string;
    };
    Storyimages: {
        id: number;
        userId: string;
        url?: string;
    }[];
    swipeUpEnabled?: boolean;
    authenticityStatus?: string;
    stadium: string;
    isViewed: boolean;
}
