// hooks/usePosts.ts
import { useEffect, useState } from "react";
// import axios from "axios";
import { BACKEND_URL } from "../config"; // Adjust import path if needed


export interface Post {
    id: number;
    content: string;
    title: string;
    createdAt: string;
    author: {
        id: number;
        username: string;
        name: string;
        image?: string;
    };
    tags?: { name: string }[];
    expanded: boolean;
}

export const usePosts = (postDisplayType = "default") => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${BACKEND_URL}/api/v1/post/bulk?groupBy=${postDisplayType}`, {
                    headers: {
                        Authorization: token ?? "",
                    },
                });
                const data = await res.json();
                setPosts(data.posts);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [postDisplayType]);

    return { loading, posts };
};

// export interface Post {
//     id: number;
//     content: string;
//     createdAt: string;
//     title: string;
//     author: {
//         username: string
//         name: string
//         image: string
//     }
//     tags?: { name: string }[];
//     expanded: boolean
//     // Add any other fields
// }

// export const usePosts = (postDisplayType = "default") => {
//     const [loading, setLoading] = useState(true);
//     const [posts, setPosts] = useState<Post[]>([]);

//     useEffect(() => {
//         const fetchPosts = async () => {
//             const token = localStorage.getItem("token");
//             try {
//                 const res = await fetch(`${BACKEND_URL}/api/v1/post/bulk?groupBy=${postDisplayType}`, {
//                     headers: {
//                         Authorization: token ?? "",
//                     },
//                 });
//                 const data = await res.json();
//                 setPosts(data.posts);
//             } catch (error) {
//                 console.error("Failed to fetch posts:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPosts();
//     }, [postDisplayType]);

//     return { loading, posts };
// };
