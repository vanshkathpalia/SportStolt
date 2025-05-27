import { BACKEND_URL } from "../config";

export const fetchSportsPlaylist = async (userName: string, userEmail: string, sportName: string, skillLevel: string, keywords: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found in local storage");

        const response = await fetch(`${BACKEND_URL}/api/v1/training/fetch-playlist`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Use "Bearer" prefix
            },
            body: JSON.stringify({ userName, userEmail, sportName, skillLevel, keywords }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to fetch playlist');
        }

        return await response.json();  // Returning the actual data after success
    } catch (error) {
        console.error('Error fetching playlist:', error);
        throw error;
    }
};
