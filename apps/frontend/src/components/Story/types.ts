export interface StoryType {
    id: number;
    locationImage: string;
    image: string;
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
    Storyimages: {
        url: string;
        UserID: string;
    }[];
    swipeUpEnabled?: boolean;
    authenticityStatus?: string;
    stadium?: string;
    isViewed?: boolean;
}
