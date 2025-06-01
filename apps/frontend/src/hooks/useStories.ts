import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config';


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
        viewed?: boolean;
    // };
    // viewed?: boolean;
    onClose: () => void;
}
export const useStories = (filterBy: 'location' | 'sport' | null) => {
  const [loading, setLoading] = useState(true);
  const [story, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      const token = localStorage.getItem('token');
      // console.log('Fetching stories with filter:', filterBy);
      
      try {
        const queryParam = filterBy ? `?filterBy=${filterBy}` : '';
        const url = `${BACKEND_URL}/api/v1/story/fetch${queryParam}`;
        // console.log('Fetching from URL:', url);
        
        const res = await fetch(url, {
          headers: {
            Authorization: token || "",
          },
        });
        const data = await res.json();
        // console.log('Received stories data:', data);
        setStories(data.stories);
      } catch (error) {
        console.error('Failed to fetch stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [filterBy]);

  return { loading, story };
};

// export const useStories = (storyDisplayType = "default") => {
// export const useStories = (groupBy: "location" | "sport" | "all") => {
//     const [loading, setLoading] = useState(true);
//     const [story, setStory] = useState<Story[]>([]);

//     useEffect(() => {
//     const fetchStories = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const queryParam = groupBy ? `?filterBy=${groupBy}` : '';
//         const res = await fetch(`${BACKEND_URL}/api/v1/story/fetch${queryParam}`, {
//           headers: {
//             Authorization: token ?? '',
//           },
//         });
//         const data = await res.json();
//         setStory(data.stories);
//       } catch (error) {
//         console.error('Failed to fetch stories:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStories();
//   }, [filterBy]);

//   return { loading, stories };
// };
