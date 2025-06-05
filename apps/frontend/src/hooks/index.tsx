import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";
// import { response } from "express";


export interface Post {
    "content": string;
    "title": string;
    "id": number;
    "author": {
        "id": number
        "username": string
        "name": string
        "image": string
    }
    "createdAt": string
}

export interface Story {
    id: number;
    locationImage: string;
    location: string;
    isViewed: boolean;
    description?: string;
    participants?: number;
    createdAt: string;
    sport?: string;
    endTime: Date;
    activityStarted: Date;
    activityEnded: Date;
    stadium?: string;
    swipeUpEnabled?: boolean;
    authenticityStatus?: string;
    verificationCount?: number;
    rewardStatus?: string;
    author: {
        username: string;
        image?: string;
        userId: string;
    };
    Storyimages?: {
        id: number;
        userId: number;
        url?: string;
        // authenticityChecked: boolean;
    }[];
}

export interface EventInterface {
    id: number;
    name: string;
    // title: string;
    // image: string;
    // description: string;
    // authorId: number;
    // eventId: number;
    // eventName: string;
    // eventDescription: string; 
    author: {
      name: string;
      avatar: string;
    };
    imageUrl: string;
    location: string;
    startTime: string;
    organisedBy: string;
    endDate: string;
    startDate: string;
    username: string;
    state: string;
    country: string;
    timing: string;
    stadium: string;
    city: string;
    likes: number;
    sportTags: string[];
    comments: Comment[];
    publishedDate: string;
    isRegistered?: boolean;
}

  
// export interface EventInterface {
//     id: number; // Assuming Prisma is autoincrementing the id
//     "image": string;
//     "name": string;
//     "country": string;
//     "state": string;
//     "title": string;
//     "city": string;
//     "authorId": number;
//     "stadium": string;
//     "startDate": Date;
//     "endDate": Date;
//     "startTime": Date;
//     "organisedBy": string;
// }

export const usePost = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<Post>();

    console.log(id);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/post/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then(response => {
            try {
                setPost(response.data.post);
                setLoading(false);
            } catch(e) {
                console.log(e);
            }
        })   
    }, [id])

    // console.log(post);

    // useEffect(() => {
        
    //     axios
    //         .get(`${BACKEND_URL}/api/v1/post/${id}`, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem("token")}`,,
    //             },
    //         })
    //         .then((response) => {
    //             console.log("Response received:", response.data);
    //             console.log("Starting to fetch posts...");
    //             setLoading(false);
    //             setPost(response.data.post || []);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching posts:", error);
    //             setLoading(false);
    //         });
    // }, [id]);

    return {
        loading,
        post
    }
}

export const useStory = (id: number) => {
    const [loading, setLoading] = useState(true);
    const [story, setStory] = useState<Story>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/story/${id}`, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                setStory(response.data.story);
                // console.log(story);
            } catch (e) {
                setError('Failed to fetch story');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [id]);
    // [id, story]);

    return { loading, story, error };
};

// export const usePosts = () => {
//     const [loading, setLoading] = useState(true);
//     const [story, setStory] = useState<Story[]>([]);
//     const [posts, setPosts] = useState<Post[]>([]); //returning the array post[]

//     useEffect(() => {
//         const token = localStorage.getItem("token");
    
//         Promise.all([
//         axios.get(`${BACKEND_URL}/api/v1/story/bulk`, { headers: { Authorization: token } }),
//         axios.get(`${BACKEND_URL}/api/v1/post/bulk`, { headers: { Authorization: token } }),
//         ])
//         .then(([storyRes, postRes]) => {
//             setStory(storyRes.data.stories);
//             setPosts(postRes.data.posts);
//         })
//         .catch((err) => {
//             console.error("Failed to fetch posts or stories:", err);
//         })
//         .finally(() => {
//             setLoading(false);
//         });
//     }, []);
      
//     // useEffect(() => {
//     //     axios
//     //         .get(`${BACKEND_URL}/api/v1/story/bulk`, {
//     //             headers: {
//     //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//     //             }
//     //         })
//     //         .then(response => {
//     //                 setStory(response.data.stories);
//     //         })
            
//     //     axios
//     //         .get(`${BACKEND_URL}/api/v1/post/bulk`, {
//     //             headers: {
//     //                 Authorization: `Bearer ${localStorage.getItem("token")}`,,
//     //             },
//     //         })
//     //         .then((response) => {
                
//     //             setPosts(response.data.posts);
//     //             setLoading(false);
//     //         })

            
//     // }, []);
//     // console.log(posts);
//     return {
//         loading,
//         posts,
//         story
//     }
// }

export const useEvents = () => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<EventInterface[]>([]);
    
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
              const token = localStorage.getItem("token");
              if (!token) {
                console.error("No token found in local storage");
                setLoading(false);
                return;
              }
      
              const response = await axios.get(`${BACKEND_URL}/api/v1/event/bulk`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
              });
      
              if (response.data) {
                setEvents(response.data); // Set the fetched events
              } else {
                console.error("Unexpected response structure:", response.data);
              }
            } catch (error) {
              console.error("Error fetching events:", error);
            } finally {
              setLoading(false); // Ensure loading is set to false after request completes
            }
          };
          fetchEvents();
        }, []);

        // axios
        //     .get(`${BACKEND_URL}/api/v1/event/bulk`, {
        //         headers: {
        //             Authorization: `Bearer ${localStorage.getItem("token")}`,
        //         }
        //     })
        //     .then(response => {
        //             setEvents(response.data?.events);
        //             setLoading(false);
        //             console.log(response.data.events)
                    
        //     })
        // }, []);

    return {
        loading,
        events
    }
}