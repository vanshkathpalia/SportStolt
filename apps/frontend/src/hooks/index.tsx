import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";


export interface Post {
    "content": string;
    "title": string;
    "id": number
    "author": {
        "name": string
    }
}

export const usePost = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [Post, setPost] = useState<Post>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/Post/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setPost(response.data.Post);
                setLoading(false);
            })
    }, [id])

    return {
        loading,
        Post
    }

}
export const usePosts = () => {
    const [loading, setLoading] = useState(true);
    const [Posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/Post/bulk`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setPosts(response.data.Posts);
                setLoading(false);
            })
    }, [])

    return {
        loading,
        Posts
    }
}