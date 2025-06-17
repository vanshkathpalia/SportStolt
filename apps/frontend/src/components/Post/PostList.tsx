import { useState, useEffect } from "react";
import { PostCard } from "./PostCard";
import { PostSkeleton } from "./PostSkeleton";
import { usePosts } from "../../hooks/usePost";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import axios from "axios";

export const PostList: React.FC = () => {
  const [postSortType, setPostSortType] = useState<"user" | "tag" | "all">("all");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [followedUsers, setFollowedUsers] = useState<{ id: number; username: string }[]>([]);
  const [followedTags, setFollowedTags] = useState<{ id: number; name: string }[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const { loading, posts } = usePosts(postSortType);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const userRes = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(userRes.data.id);

        const followRes = await axios.get(`${BACKEND_URL}/api/v1/search/followed`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowedUsers(followRes.data.followedUsers);
        setFollowedTags(followRes.data.followedTags);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSortTypeChange = (type: "user" | "tag" | "all") => {
    const followedOtherUsers = followedUsers.filter(user => user.id !== currentUserId);

    if (type === "user") {
      if (followedOtherUsers.length === 0) {
        setAlertMessage("You haven't followed any users yet.");
        setShowAlert(true);
        return;
      }
    }

    if (type === "tag") {
      if (followedTags.length === 0) {
        setAlertMessage("You haven't followed any tags yet.");
        setShowAlert(true);
        return;
      }
    }

    setPostSortType(type);
  };

  const handleAlertConfirm = () => {
    setShowAlert(false);
    navigate("/search");
  };

  if (loading) {
    return (
      <>
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <PostSkeleton key={index} />
          ))}
      </>
    );
  }

  if (posts.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-10">No posts available</p>;
  }

  return (
    <div className="pl-2">
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Not Followed
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{alertMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={handleAlertConfirm}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Search Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => handleSortTypeChange("user")}
            className={`px-3 py-1 text-sm rounded-full transition ${
              postSortType === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => handleSortTypeChange("tag")}
            className={`px-3 py-1 text-sm rounded-full transition ${
              postSortType === "tag"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Tags
          </button>
          {postSortType !== "all" && (
            <button
              onClick={() => setPostSortType("all")}
              className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-16">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            author={post.author}
            title={post.title}
            createdAt={post.createdAt}
            content={post.content}
            expanded={post.expanded ?? false}
          />
        ))}
      </div>
    </div>
  );
};


// import { useState, useEffect } from "react";
// import { PostCard } from "./PostCard";
// import { PostSkeleton } from "./PostSkeleton";
// import { usePosts } from "../../hooks/usePost";
// import { useNavigate } from "react-router-dom";
// import { BACKEND_URL } from "../../config";
// import axios from "axios";

// export const PostList: React.FC = () => {
//   const [postSortType, setPostSortType] = useState<"user" | "tag" | "all">("all");
//   const [effectiveSortType, setEffectiveSortType] = useState<"user" | "tag" | "all">("all");
//   const [showAlert, setShowAlert] = useState(false);
//   const [followedUsers, setFollowedUsers] = useState<{ id: number; username: string }[]>([]);
//   const [followedTags, setFollowedTags] = useState<{ id: number; name: string }[]>([]);
//   const [currentUserId, setCurrentUserId] = useState<number | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("No token found");
//           return;
//         }

//         const userResponse = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const userData = userResponse.data;
//         setCurrentUserId(userData.id);

//         const followedResponse = await axios.get(`${BACKEND_URL}/api/v1/search/followed`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const followedData = followedResponse.data;
//         setFollowedUsers(followedData.followedUsers);
//         setFollowedTags(followedData.followedTags);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Update effectiveSortType depending on followed lists and user choice
//   useEffect(() => {
//     if (postSortType === "user") {
//       const otherFollowedUsers = followedUsers.filter((user) => user.id !== currentUserId);
//       if (otherFollowedUsers.length === 0) {
//         // No other followed users
//         if (followedTags.length > 0) {
//           // fallback to tags, no alert
//           setEffectiveSortType("tag");
//           setShowAlert(false);
//           return;
//         } else {
//           // no followed tags either, alert
//           setShowAlert(true);
//           return;
//         }
//       }
//       setEffectiveSortType("user");
//       setShowAlert(false);
//     } else if (postSortType === "tag") {
//       if (followedTags.length === 0) {
//         // No followed tags
//         const otherFollowedUsers = followedUsers.filter((user) => user.id !== currentUserId);
//         if (otherFollowedUsers.length > 0) {
//           // fallback to users, no alert
//           setEffectiveSortType("user");
//           setShowAlert(false);
//           return;
//         } else {
//           // no followed users either, alert
//           setShowAlert(true);
//           return;
//         }
//       }
//       setEffectiveSortType("tag");
//       setShowAlert(false);
//     } else {
//       // 'all' selected
//       setEffectiveSortType("all");
//       setShowAlert(false);
//     }
//   }, [postSortType, followedUsers, followedTags, currentUserId]);

//   const { loading, posts } = usePosts(effectiveSortType);

//   const handleSortTypeChange = (type: "user" | "tag" | "all") => {
//     setPostSortType(type);
//   };

//   const handleAlertConfirm = () => {
//     setShowAlert(false);
//     navigate("/search");
//   };

//   if (loading) {
//     return (
//       <>
//         {Array(3)
//           .fill(0)
//           .map((_, index) => (
//             <PostSkeleton key={index} />
//           ))}
//       </>
//     );
//   }

//   if (posts.length === 0) {
//     return <p className="text-center text-gray-500 dark:text-gray-400 py-10">No posts available</p>;
//   }

//   return (
//     <div className="pl-2">
//       {showAlert && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
//             <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
//               Not Followed
//             </h2>
//             <p className="text-gray-600 dark:text-gray-300 mb-6">
//               You haven't followed any. Please follow some to view posts.
//             </p>
//             <div className="flex justify-end">
//               <button
//                 onClick={handleAlertConfirm}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 Search Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="mt-4 mb-6">
//         <div className="flex justify-between items-center">
//           <div className="flex space-x-2">
//             <button
//               onClick={() => handleSortTypeChange("user")}
//               className={`px-3 py-1 text-sm rounded-full transition ${
//                 postSortType === "user"
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
//               }`}
//             >
//               Users
//             </button>
//             <button
//               onClick={() => handleSortTypeChange("tag")}
//               className={`px-3 py-1 text-sm rounded-full transition ${
//                 postSortType === "tag"
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
//               }`}
//             >
//               Tags
//             </button>
//             {postSortType !== "all" && (
//               <button
//                 onClick={() => setPostSortType("all")}
//                 className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
//               >
//                 Clear Filter
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4 mb-16">
//         {posts.map((post) => (
//           <PostCard
//             key={post.id}
//             id={post.id}
//             author={post.author}
//             title={post.title}
//             createdAt={post.createdAt}
//             content={post.content}
//             expanded={false}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };


// export const PostList: React.FC = () => {
//   const [postSortType, setPostSortType] = useState<"user" | "tag" | "all">("all");
//   const [showAlert, setShowAlert] = useState(false);
//   const [followedUsers, setFollowedUsers] = useState<{ id: number; username: string }[]>([]);
//   const [followedTags, setFollowedTags] = useState<{ id: number; name: string }[]>([]);
//   const [currentUserId, setCurrentUserId] = useState<number | null>(null);
//   const navigate = useNavigate();

//   const { loading, posts } = usePosts(postSortType);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("No token found");
//           return;
//         }

//         const userResponse = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const userData = userResponse.data;
//         setCurrentUserId(userData.id);

//         const followedResponse = await axios.get(`${BACKEND_URL}/api/v1/search/followed`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const followedData = followedResponse.data;
//         setFollowedUsers(followedData.followedUsers);
//         setFollowedTags(followedData.followedTags);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleSortTypeChange = (type: "user" | "tag" | "all") => {
//     if (type === "user") {
//       const otherFollowedUsers = followedUsers.filter(user => user.id !== currentUserId);
//       if (otherFollowedUsers.length === 0) {
//         setShowAlert(true);
//         return;
//       }
//     } else if (type === "tag") {
//       if (followedTags.length === 0) {
//         setShowAlert(true);
//         return;
//       }
//     }
//     setPostSortType(type);
//   };

//   const handleAlertConfirm = () => {
//     setShowAlert(false);
//     navigate("/search");
//   };

//   if (loading) {
//     return (
//       <>
//         {Array(3)
//           .fill(0)
//           .map((_, index) => (
//             <PostSkeleton key={index} />
//           ))}
//       </>
//     );
//   }

//   if (posts.length === 0) {
//     return <p className="text-center text-gray-500 dark:text-gray-400 py-10">No posts available</p>;
//   }

//   return (
//     <div className="pl-2">
//       {/* Alert Modal */}
//       {showAlert && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
//             <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
//               Not Followed
//             </h2>
//             <p className="text-gray-600 dark:text-gray-300 mb-6">
//               You haven't followed any. Please follow some to view posts.
//             </p>
//             <div className="flex justify-end">
//               <button
//                 onClick={handleAlertConfirm}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 Search Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="mt-4 mb-6">
//         <div className="flex justify-between items-center">
//           <div className="flex space-x-2">
//             <button
//               onClick={() => handleSortTypeChange("user")}
//               className={`px-3 py-1 text-sm rounded-full transition ${
//                 postSortType === "user"
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
//               }`}
//             >
//               Users
//             </button>
//             <button
//               onClick={() => handleSortTypeChange("tag")}
//               className={`px-3 py-1 text-sm rounded-full transition ${
//                 postSortType === "tag"
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
//               }`}
//             >
//               Tags
//             </button>
//             {postSortType !== "all" && (
//               <button
//                 onClick={() => setPostSortType("all")}
//                 className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
//               >
//                 Clear Filter
//               </button>
//             )}
//             {/* {postSortType && (
//               <button
//                 onClick={() => setPostSortType("all")}
//                 className="px-4 py-2 text-sm rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
//               >
//                 Clear Filter
//               </button>
//             )} */}
//           </div>
//         </div>
//       </div>
//       <div className="space-y-4 mb-16">
//         {posts.map((post) => (
//           <PostCard
//             key={post.id}
//             id={post.id}
//             author={post.author}
//             title={post.title}
//             createdAt={post.createdAt}
//             content={post.content}
//             expanded={false}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };


// import { useState } from "react";
// import { PostCard } from "./PostCard";
// import { PostSkeleton } from "./PostSkeleton";
// import { usePosts } from "../../hooks/usePost";

// // export const PostList => {
// export const PostList: React.FC = () => {
//     const [postSortType, setPostSortType] = useState<"user" | "tag" | "all">("all")
//     // const [storyDisplayType, setStoryDisplayType] = useState<"location" | "sport" | "all">("all");
//     const { loading, posts } = usePosts(postSortType)

//     if (loading) {
//         return (
//             <>
//             {Array(3)
//                 .fill(0)
//                 .map((_, index) => ( <PostSkeleton key={index} />
//             ))}
//             </> 
//         )
//     }

//     if (posts.length === 0) {
//         return <p className="text-center text-gray-500 dark:text-gray-400 py-10">No posts available</p>;
//     }

//     return (
//     <div className="pl-2">
//         <div className="mt-4 mb-6"> 
//             <div className="flex justify-between items-center">                     
//                 <div className="flex space-x-2">
//                     <button
//                     onClick={() => setPostSortType("user")}
//                     className={`px-3 py-1 text-sm rounded-full transition ${
//                         postSortType === "user"
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
//                     }`}
//                     >
//                     Users
//                     </button>
//                     <button
//                     onClick={() => setPostSortType("tag")}
//                     className={`px-3 py-1 text-sm rounded-full transition ${
//                         postSortType === "tag"
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
//                     }`}
//                     >
//                     Tags
//                     </button>
//                 </div>
//             </div>
//         </div>
//         <div className="space-y-12">
//             {posts.map((post) => (
//                 <PostCard
//                 key={post.id}
//                 id={post.id}
//                 author={post.author}
//                 title={post.title}
//                 createdAt={post.createdAt}
//                 content={post.content}
//                 expanded={false}
//                 />
//             ))}
//         </div>
//     </div>
//   );
// };
