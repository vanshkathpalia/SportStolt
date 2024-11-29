import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";


export interface Post {
    "content": string;
    "title": string;
    "id": number;
    "author": {
        "name": string
    }
}

interface Story {
    "location": string;
    "image": string;
    "isViewed"?: boolean;
    "id": number;
    "author": {
        "name": string
    }
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
    const [story, setstory] = useState<Story[]>([]);
    const [posts, setPosts] = useState<Post[]>([]); //returning the array post[]

    const token = localStorage.getItem("token");
    console.log("Authorization Token:", token);

    useEffect(() => {
        // const token = localStorage.getItem("token");
        // console.log("Authorization Token:", token);
        // console.log("Authorization Token:", token);
        // console.log("Authorization Token:", token);
        axios
            .get(`${BACKEND_URL}/api/v1/story/bulk`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            .then(response => {
                    setstory(response.data.stories);
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

