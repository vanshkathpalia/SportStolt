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
