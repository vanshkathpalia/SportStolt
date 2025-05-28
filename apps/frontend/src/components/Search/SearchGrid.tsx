import { Heart, MessageCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../config';

interface SearchGridProps {
  posts: string[];
}

interface User {
  id: number;
  username: string;
}

interface Tag {
  id: number;
  name: string;
  followed: boolean;
}

export const SearchGrid = ({ posts }: SearchGridProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ users: User[]; tags: Tag[] }>({ users: [], tags: [] });

  const navigate = useNavigate();

  const [followedUsers, setFollowedUsers] = useState<User[]>([]);
  const [followedTags, setFollowedTags] = useState<Tag[]>([]);

  const [showNoResults, setShowNoResults] = useState(false);

  const toggleFollowUser = async (username: string) => {
    const user = results.users.find(u => u.username === username);
    if (!user) return;

    try {
      const isFollowing = followedUsers.some(u => u.username === username);

      if (isFollowing) {
        await axios.delete(`${BACKEND_URL}/api/v1/search/follow/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFollowedUsers(prev => prev.filter(u => u.username !== username));
      } else {
        await axios.post(`${BACKEND_URL}/api/v1/search/follow/user/${user.id}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFollowedUsers(prev => [...prev, user]);
      }
    } catch (error) {
      console.error('Follow/unfollow user failed:', error);
    }
  };


  // const toggleFollowTag = async (tag: Tag) => {
  //   try {
  //     const isFollowing = followedTags.some(t => t.id === tag.id);

  //     if (isFollowing) {
  //       await axios.delete(`${BACKEND_URL}/api/v1/search/follow/tag/${tag.id}`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       });

  //       setFollowedTags(prev => prev.filter(t => t.id !== tag.id));
  //     } else {
  //       await axios.post(`${BACKEND_URL}/api/v1/search/follow/tag/${tag.id}`, {}, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       });

  //       setFollowedTags(prev => [...prev, tag]);
  //     }
  //   } catch (error) {
  //     console.error('Follow/unfollow tag failed:', error);
  //   }
  // };

  const toggleFollowTag = async (tag: Tag) => {
    try {
      const isFollowing = followedTags.some(t => t.id === tag.id);

      if (isFollowing) {
        await axios.delete(`${BACKEND_URL}/api/v1/search/follow/tag/${tag.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setFollowedTags(prev => prev.filter(t => t.id !== tag.id));
      } else {
        await axios.post(`${BACKEND_URL}/api/v1/search/follow/tag/${tag.id}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setFollowedTags(prev => [...prev, tag]);
      }
    } catch (error) {
      console.error('Follow/unfollow tag failed:', error);
    }
  };

  // const toggleFollowTag = async (tag: Tag) => {
  //   try {
  //     if (followedTags.includes(tag)) {
  //       await axios.delete(`${BACKEND_URL}/api/v1/search/follow/tag/${tag}`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       });
  //     } else {
  //       await axios.post(`${BACKEND_URL}/api/v1/search/follow/tag/${tag}`, {}, { 
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         }, 
  //       });
  //     }

  //     setFollowedTags(prev =>
  //       prev.includes(tag)
  //         ? prev.filter((t) => t !== tag)
  //         : [...prev, tag]
  //     );
  //   } catch (error) {
  //     console.error('Follow/unfollow tag failed:', error);
  //   }
  // };

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     if (query.trim().length > 0) {
  //       axios.get(`${BACKEND_URL}/api/v1/search?q=${encodeURIComponent(query)}`, { 
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       })
  //         .then(res => setResults(res.data))
  //         .catch(err => console.error(err));
  //     } else {
  //       setResults({ users: [], tags: [] });
  //     }
  //   }, 300);
  //   return () => clearTimeout(delayDebounceFn);
  // }, [query]);

  useEffect(() => {
    console.log("useEffect triggered with query:", query);
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 0) {
        try {
          console.log("Entered try block");
          const token = localStorage.getItem("token");
          console.log(localStorage.getItem("token"));
          console.log('Backend URL:', BACKEND_URL);

          const [searchRes, followRes] = await Promise.all([
            axios.get(`${BACKEND_URL}/api/v1/search?q=${encodeURIComponent(query)}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BACKEND_URL}/api/v1/search/followed`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setResults(searchRes.data);
          setFollowedUsers(followRes.data.followedUsers);
          setFollowedTags(followRes.data.followedTags);
        } catch (err) {
          console.error("Outer catch error:", err);
          console.error(err);
        }
      } else {
        // Hide dropdown if query is empty
        setResults({ users: [], tags: [] });
        setFollowedUsers([]);
        setFollowedTags([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    // Reset the flag whenever query changes
    setShowNoResults(false);

    if (query.trim().length === 0) return;

    // Set a timeout to show the "No results" after 3 seconds of no typing
    const timer = setTimeout(() => {
      setShowNoResults(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    // Clear everything on route change
    setQuery('');
    setResults({ users: [], tags: [] });
    setFollowedUsers([]);
    setFollowedTags([]);
  },[]);
  // }, [location.pathname]);


  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Search Bar */}
      <div className="sticky top-14 md:top-0 z-20 bg-background md:p-4 border-gray-300">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <form onSubmit={(e) => e.preventDefault()}  className="max-w-md mx-auto">
            <label htmlFor="default-search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="search"
                id="default-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                placeholder="Search users or sports..."
                required
              />
              {/* <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button> */}

              {/* Dropdown */}
              {(results.users.length > 0 || results.tags.length > 0) ? (
                <div className="absolute z-30 mt-2 w-full bg-white border rounded shadow-md max-h-60 overflow-y-auto">
                  {/* {results.users.map((user, idx) => ( */}
                  {results.users.map((user, idx) => (
                    <div
                      key={`user-${user.id}-${idx}`}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => navigate(`/profile/${user.username}`)}
                    >
                      <span>👤 {user.username}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFollowUser(user.username);
                        }}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {followedUsers.some(f => f.username === user.username) ? 'Unfollow' : 'Follow'}
                      </button>
                    </div>
                  ))}

                  {/* {results.tags.map((tag, idx) => (
                    <div key={`tag-${idx}`} className="...">
                      <span>{tag.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFollowTag(tag.name); // pass tag name only
                        }}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {followedTags.includes(tag.name) ? 'Unfollow' : 'Follow'}
                      </button>
                    </div>
                  ))} */}

                  {results.tags.map((tag, idx) => (
                    <div
                      key={`tag-${idx}`}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleFollowTag(tag)}
                    >
                      <div key={tag.id}>
                        <span>#{tag.name}</span>
                      </div>f
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFollowTag(tag);
                        }}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {followedTags.some(t => t.id === tag.id) ? 'Unfollow' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              // ) : query.trim().length > 0 ? (
                ) : showNoResults ? (
                  <div className="absolute z-30 mt-2 w-full bg-white border rounded shadow-md p-2 text-center text-gray-500">
                    No user or tag found.
                  </div>
                ) : null}

            </div>
          </form>

        </div>
      </div>

      {/* Scrollable Grid */}
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-4 max-w-7xl p-4 m-2 sm:col-span-8 md:col-span-6">
          {posts.map((post, index) => (
            <div key={index} className="relative group aspect-square">
              <img src={post} alt={`Post ${index + 1}`} className="w-full h-full object-cover" />
              <div
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-6 text-white">
                  <div className="flex items-center gap-1">
                    <Heart className="w-6 h-6" />
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-semibold">0</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
