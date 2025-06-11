// hooks/useProfile.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface ProfileData {
  name: string;
  username: string;
  profileImage: string;
  postsCount: number;
  storiesCount: number;
  verifiedStoriesCount: number;
  legitimacy: string;
  badge: string;
  followersCount: number;
  followingCount: number;
  achievements: string;
  location: string;
  university: string;
  points: number;
  bio: string;
  hasPaid: boolean;
}

export const useProfile = (userId: number) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${BACKEND_URL}/api/v1/user/${userId}/profile`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch user profile:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  console.log("Profile data:", profile);

  return { loading, profile };
};
