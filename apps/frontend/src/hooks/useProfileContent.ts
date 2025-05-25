import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { PostType, EventType  } from "./types";

type Tab = "posts" | "events" | "saved";

export const useProfileContent = (userId: number | undefined, activeTab: Tab) => {
  const [loading, setLoading] = useState(true);

  // Use union type or optional depending on your rendering logic
  const [posts, setPosts] = useState<PostType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
//   const [saved, setSaved] = useState<SavedType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    // Determine endpoint and setter based on tab
    let url = "";
    switch (activeTab) {
      case "posts":
        url = `${BACKEND_URL}/api/v1/user/${userId}/posts`;
        break;
      case "events":
        url = `${BACKEND_URL}/api/v1/user/${userId}/events`;
        break;
    //   case "saved":
    //     url = `${BACKEND_URL}/api/v1/user/${userId}/saved`;
    //     break;
      default:
        break;
    }

    axios
      .get(url, {
        headers: { Authorization: token || "" },
      })
      .then((res) => {
        console.log("Response data:", res.data.posts);
        if (activeTab === "posts") {
          setPosts(res.data);
        } else if (activeTab === "events") {
          setEvents(res.data);
        } 
        // else if (activeTab === "saved") {
        //   setSaved(res.data.saved);
        // }
      })
      .catch((err) => {
        setError("Failed to fetch data");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId, activeTab]);

    console.log("Posts:", posts);
    console.log("Events:", events);

  return { loading, posts, events, error };
};
