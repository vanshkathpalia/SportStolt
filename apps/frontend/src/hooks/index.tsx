import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";
// import { response } from "express";


export interface Post {
    "content": string;
    "title": string;
    "id": number;
    "author": {
        "name": string
    }
}

export interface Story {
    "location": string;
    "image": string;
    "isViewed"?: boolean;
    "id": number;
    "author": {
        "name": string
    }
}

export interface EventInterface {
    "id": number; // Assuming Prisma is autoincrementing the id
    "image": string;
    "city": string;
    "authorId": number;
    "stadium": string;
    "startDate": Date;
    "endDate": Date;
    "startTime": Date;
    "organisedBy": string;
}

export const usePost = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<Post>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/post/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(response => {
                setPost(response.data.post);
                setLoading(false);
            })
    }, [id])

    // useEffect(() => {
        
    //     axios
    //         .get(`${BACKEND_URL}/api/v1/post/${id}`, {
    //             headers: {
    //                 Authorization: localStorage.getItem("token"),
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

export const usePosts = () => {
    const [loading, setLoading] = useState(true);
    const [story, setStory] = useState<Story[]>([]);
    const [posts, setPosts] = useState<Post[]>([]); //returning the array post[]

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/story/bulk`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            .then(response => {
                    setStory(response.data.stories);
            })
            
        axios
            .get(`${BACKEND_URL}/api/v1/post/bulk`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            .then((response) => {
                
                setPosts(response.data.posts);
                setLoading(false);
            })

            
    }, []);

    return {
        loading,
        posts,
        story
    }
}

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
                  Authorization: token, // Use "Bearer" prefix if required by your API
                },
              });
      
              if (response.data) {
                console.log(response.data.events);
                
                console.log("lfo")
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
        //             Authorization: localStorage.getItem("token")
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

// export const useImages = () => {
//     const [loading, setLoading] = useState(true);
//     const [images, setImages] = useState<string[]>([]);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchImages = async () => {
//             setLoading(true);
//             setError(null);

//             try {
//                 const imagePromises = Array.from({ length: 12 }, () =>
//                     axios.get('https://api.api-ninjas.com/v1/randomimage?category=nature', {
//                         headers: { 'X-Api-Key': 'YOUR_API_KEY' }, // Replace with your API key
//                         responseType: 'arraybuffer', // Fetching binary data as an image
//                     })
//                 );

//                 const responses = await Promise.all(imagePromises);

//                 const fetchedImages = responses.map((response) =>
//                     URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' })) // Convert binary data to object URL
//                 );

//                 setImages(fetchedImages);
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : "An error occurred");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchImages();
//     }, []);

//     return { loading, images, error };
// };

