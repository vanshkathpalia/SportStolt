export interface StoryType {
    id: number;
    locationImage: string;
    image: string;
    location: string;
    description?: string;
    activityStarted: Date;
    activityEnded: Date;
    participants?: number;
    createdAt: string;
    sport?: string;
    endTime: any;
    author: {
        username: string;
        image?: string;
        userId: string;
    };
    Storyimages: {
        id: number;
        url?: string;
        userId: string;
    }[];
    swipeUpEnabled?: boolean;
    authenticityStatus?: string;
    stadium?: string;
    isViewed?: boolean;
}
