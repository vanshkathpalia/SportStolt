"use client"

import { useState, useEffect } from "react"
// import { useSelector } from "react-redux"
import { Sidebar } from "../components/StickyBars/Sidebar"
import { MobileNav } from "../components/StickyBars/MobileNav"
import { useMediaQuery } from "../hooks/useMediaQuery"
import { Heart, MessageCircle, UserPlus, Calendar, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

// Mock data
import { NOTIFICATIONS } from "../mockData/Notification"
import axios from "axios"
import { BACKEND_URL } from "../config"
// import axios from "axios"

// Group notifications by time
const TODAY_NOTIFICATIONS = NOTIFICATIONS.filter((n) => n.time.includes("ago") || n.time === "Today")
const EARLIER_NOTIFICATIONS = NOTIFICATIONS.filter((n) => n.time === "Yesterday" || n.time.includes("days"))
// const userId = useSelector((state: any) => state.auth.userId); // Change `any` to the correct type

interface NotificationsPageProps {
  openCreateModal: () => void
}

export default function NotificationsPage({ openCreateModal }: NotificationsPageProps) {
  const [loading, setLoading] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")
  // const [userId, setUserId] = useState<number | null>(null)

  // useEffect(() => {
  //   console.log("Checking auth token before fetching user...")
  //   const token = localStorage.getItem("authToken")

  //   if (!token) {
  //     console.error("Auth token missing! User is not logged in.")
  //     return
  //   }

  // const fetchCurrentUser = async () => {
  //   console.log("Fetching current user...") 
  //   try {
  //     const token = localStorage.getItem("authToken"); // Retrieve the stored JWT token
  //     if (!token) {
  //       console.log("No auth token found.")
  //       throw new Error("No auth token found")
  //     }
      
  //     console.log("Sending request to:", `${BACKEND_URL}/api/v1/user/me`)
  //     const response = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Ensure Authorization header is sent
  //       },
  //     });

  //     console.log("Response received:", response.data)

  //     if (response.data && response.data.id) {
  //       setUserId(response.data.id)
  //     }
  //   } catch (error) {
  //     console.error("Error fetching current user:", error)
  //     // Fallback to localStorage if API fails
  //     const storedUserId = localStorage.getItem("userId")
  //     if (storedUserId) {
  //       setUserId(Number.parseInt(storedUserId, 10))
  //     }
  //   }
  // }
  
  //   fetchCurrentUser()
  // }, [])

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Function to render notification icon based on type
  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "event":
        return <Calendar className="h-4 w-4 text-purple-500" />
      case "story_verification":
        return <CheckCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Heart className="h-4 w-4 text-muted-foreground" />
    }
  }

  const handleVerification = async (notificationId: number, isVerified: boolean) => {

    // console.log("User ID at verification time:", userId)

    // if (!userId) {
    //   alert("You must be logged in to verify stories")
    //   return
    // }

    try {
      // This should point to your Hono backend endpoint
      const res = await axios.post(`${BACKEND_URL}/api/v1/notification/verify`, {
        notificationId,
        // userId,
        isVerified,
      })

      console.log("Verification response:", res.status, res.data)

      if (res.status === 200) {
        // Update UI to reflect the verification
        // You could update the local state to show the notification has been verified
        alert(`Verification updated: ${isVerified ? "Yes" : "No"}`)
      } else {
        alert("Failed to update verification. Try again.")
      }
    } catch (error) {
      console.error("Error updating verification status", error)
      alert("Something went wrong!")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header - Only visible on mobile */}
      {isMobile && <MobileNav openCreateModal={openCreateModal} />}

      <div className="flex">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden md:block w-16 lg:w-64 fixed h-screen">
          <Sidebar openCreateModal={openCreateModal} />
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-16 lg:ml-64 pb-16 md:pb-8">
          <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Notifications</h1>

            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="mentions">Mentions</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                {loading ? (
                  // Loading skeletons
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                            <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div>
                    {/* Today's notifications */}
                    <h2 className="text-sm font-medium text-muted-foreground mb-2">Today</h2>
                    <div className="space-y-1 mb-6">
                      {TODAY_NOTIFICATIONS.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={notification.user.avatar} />
                            <AvatarFallback>{notification.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-medium">{notification.user.name}</span> {notification.content}
                            </p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {renderNotificationIcon(notification.type)}

                            {notification.postPreview && (
                              <div className="h-10 w-10 rounded-md overflow-hidden">
                                <img
                                  src={notification.postPreview || "/placeholder.svg"}
                                  alt="Post preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}

                            {notification.type === "follow" && (
                              <Button size="sm" variant="outline" className="text-xs h-8">
                                Follow
                              </Button>
                            )}

                            {notification.type === "story_verification" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs h-8 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                  onClick={() => handleVerification(notification.id, true)}
                                >
                                  Yes
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs h-8 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                  onClick={() => handleVerification(notification.id, false)}
                                >
                                  No
                                </Button>
                              </div>
                            )}

                            {notification.type === "event" && (
                              <Button size="sm" variant="outline" className="text-xs h-8">
                                View
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Earlier notifications */}
                    <h2 className="text-sm font-medium text-muted-foreground mb-2">Earlier</h2>
                    <div className="space-y-1">
                      {EARLIER_NOTIFICATIONS.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={notification.user.avatar} />
                            <AvatarFallback>{notification.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-medium">{notification.user.name}</span> {notification.content}
                            </p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {renderNotificationIcon(notification.type)}

                            {notification.postPreview && (
                              <div className="h-10 w-10 rounded-md overflow-hidden">
                                <img
                                  src={notification.postPreview || "/placeholder.svg"}
                                  alt="Post preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}

                            {notification.type === "follow" && (
                              <Button size="sm" variant="outline" className="text-xs h-8">
                                Follow
                              </Button>
                            )}

                            {notification.type === "event" && (
                              <Button size="sm" variant="outline" className="text-xs h-8">
                                View
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="mentions" className="mt-4">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No mentions yet</h3>
                  <p className="text-muted-foreground max-w-sm">
                    When someone mentions you in a comment or post, you'll see it here.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-4">
                <div className="space-y-1">
                  {NOTIFICATIONS.filter((n) => n.type === "event").map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification.user.avatar} />
                        <AvatarFallback>{notification.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{notification.user.name}</span> {notification.content}
                        </p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <Button size="sm" variant="outline" className="text-xs h-8">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

// "use client"

// import { useState, useEffect } from "react"
// // import { useSelector } from "react-redux"
// import { Sidebar } from "../components/StickyBars/Sidebar"
// import { MobileNav } from "../components/StickyBars/MobileNav"
// import { useMediaQuery } from "../hooks/useMediaQuery"
// import { Heart, MessageCircle, UserPlus, Calendar, CheckCircle } from "lucide-react"
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
// import { Button } from "../components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

// // Mock data
// import { NOTIFICATIONS } from "../mockData/Notification"
// import axios from "axios"
// // import axios from "axios"

// // Group notifications by time
// const TODAY_NOTIFICATIONS = NOTIFICATIONS.filter((n) => n.time.includes("ago") || n.time === "Today")
// const EARLIER_NOTIFICATIONS = NOTIFICATIONS.filter((n) => n.time === "Yesterday" || n.time.includes("days"))
// // const userId = useSelector((state: any) => state.auth.userId); // Change `any` to the correct type

// interface NotificationsPageProps {
//   openCreateModal: () => void
// }

// export default function NotificationsPage({ openCreateModal }: NotificationsPageProps) {
//   const [loading, setLoading] = useState(true)
//   const isMobile = useMediaQuery("(max-width: 768px)")

//   useEffect(() => {
//     // Simulate loading data
//     const timer = setTimeout(() => {
//       setLoading(false)
//     }, 1000)

//     return () => clearTimeout(timer)
//   }, [])

//   // Function to render notification icon based on type
//   const renderNotificationIcon = (type: string) => {
//     switch (type) {
//       case "like":
//         return <Heart className="h-4 w-4 text-red-500" />
//       case "comment":
//         return <MessageCircle className="h-4 w-4 text-blue-500" />
//       case "follow":
//         return <UserPlus className="h-4 w-4 text-green-500" />
//       case "event":
//         return <Calendar className="h-4 w-4 text-purple-500" />
//       case "story_verification":
//         return <CheckCircle className="h-4 w-4 text-orange-500" />
//       default:
//         return <Heart className="h-4 w-4 text-muted-foreground" />
//     }
//   }

//   const handleVerification = async (notificationId: number, isVerified: boolean, userId: number) => {
//     try {
//       const res = await axios.post("/api/notification/verify", {
//         notificationId,
//         userId, // Include the current user ID
//         isVerified,
//       });
  
//       if (res.status === 200) {
//         alert(`Verification updated: ${isVerified ? "Yes" : "No"}`);
//       } else {
//         alert("Failed to update verification. Try again.");
//       }
//     } catch (error) {
//       console.error("Error updating verification status", error);
//       alert("Something went wrong!");
//     }
//   };
  

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Mobile Header - Only visible on mobile */}
//       {isMobile && <MobileNav openCreateModal={openCreateModal} />}

//       <div className="flex">
//         {/* Sidebar - Hidden on mobile */}
//         <div className="hidden md:block w-16 lg:w-64 fixed h-screen">
//           <Sidebar openCreateModal={openCreateModal} />
//         </div>

//         {/* Main Content */}
//         <main className="flex-1 md:ml-16 lg:ml-64 pb-16 md:pb-8">
//           <div className="max-w-2xl mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-6">Notifications</h1>

//             <Tabs defaultValue="all" className="mb-6">
//               <TabsList className="grid w-full grid-cols-3">
//                 <TabsTrigger value="all">All</TabsTrigger>
//                 <TabsTrigger value="mentions">Mentions</TabsTrigger>
//                 <TabsTrigger value="events">Events</TabsTrigger>
//               </TabsList>

//               <TabsContent value="all" className="mt-4">
//                 {loading ? (
//                   // Loading skeletons
//                   <div className="space-y-4">
//                     {Array(5)
//                       .fill(0)
//                       .map((_, index) => (
//                         <div key={index} className="flex items-center gap-3 p-3 rounded-lg">
//                           <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
//                           <div className="flex-1 space-y-2">
//                             <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
//                             <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 ) : (
//                   <div>
//                     {/* Today's notifications */}
//                     <h2 className="text-sm font-medium text-muted-foreground mb-2">Today</h2>
//                     <div className="space-y-1 mb-6">
//                       {TODAY_NOTIFICATIONS.map((notification) => (
//                         <div
//                           key={notification.id}
//                           className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
//                         >
//                           <Avatar className="h-10 w-10">
//                             <AvatarImage src={notification.user.avatar} />
//                             <AvatarFallback>{notification.user.name.charAt(0).toUpperCase()}</AvatarFallback>
//                           </Avatar>

//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm">
//                               <span className="font-medium">{notification.user.name}</span> {notification.content}
//                             </p>
//                             <p className="text-xs text-muted-foreground">{notification.time}</p>
//                           </div>

//                           <div className="flex items-center gap-2">
//                             {renderNotificationIcon(notification.type)}

//                             {notification.postPreview && (
//                               <div className="h-10 w-10 rounded-md overflow-hidden">
//                                 <img
//                                   src={notification.postPreview || "/placeholder.svg"}
//                                   alt="Post preview"
//                                   className="h-full w-full object-cover"
//                                 />
//                               </div>
//                             )}

//                             {notification.type === "follow" && (
//                               <Button size="sm" variant="outline" className="text-xs h-8">
//                                 Follow
//                               </Button>
//                             )}

//                             {notification.type === "story_verification" && userId &&(
//                               <div className="flex gap-2">
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   className="text-xs h-8"
//                                   onClick={() => handleVerification(notification.id, true, userId)}
//                                 >
//                                   Yes
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   className="text-xs h-8"
//                                   onClick={() => handleVerification(notification.id, false, userId)}
//                                 >
//                                   No
//                                 </Button>
//                               </div>
//                             )}


//                             {notification.type === "event" && (
//                               <Button size="sm" variant="outline" className="text-xs h-8">
//                                 View
//                               </Button>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Earlier notifications */}
//                     <h2 className="text-sm font-medium text-muted-foreground mb-2">Earlier</h2>
//                     <div className="space-y-1">
//                       {EARLIER_NOTIFICATIONS.map((notification) => (
//                         <div
//                           key={notification.id}
//                           className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
//                         >
//                           <Avatar className="h-10 w-10">
//                             <AvatarImage src={notification.user.avatar} />
//                             <AvatarFallback>{notification.user.name.charAt(0).toUpperCase()}</AvatarFallback>
//                           </Avatar>

//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm">
//                               <span className="font-medium">{notification.user.name}</span> {notification.content}
//                             </p>
//                             <p className="text-xs text-muted-foreground">{notification.time}</p>
//                           </div>

//                           <div className="flex items-center gap-2">
//                             {renderNotificationIcon(notification.type)}

//                             {notification.postPreview && (
//                               <div className="h-10 w-10 rounded-md overflow-hidden">
//                                 <img
//                                   src={notification.postPreview || "/placeholder.svg"}
//                                   alt="Post preview"
//                                   className="h-full w-full object-cover"
//                                 />
//                               </div>
//                             )}

//                             {notification.type === "follow" && (
//                               <Button size="sm" variant="outline" className="text-xs h-8">
//                                 Follow
//                               </Button>
//                             )}

//                             {notification.type === "event" && (
//                               <Button size="sm" variant="outline" className="text-xs h-8">
//                                 View
//                               </Button>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </TabsContent>

//               <TabsContent value="mentions" className="mt-4">
//                 <div className="flex flex-col items-center justify-center py-12 text-center">
//                   <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
//                   <h3 className="text-lg font-medium">No mentions yet</h3>
//                   <p className="text-muted-foreground max-w-sm">
//                     When someone mentions you in a comment or post, you'll see it here.
//                   </p>
//                 </div>
//               </TabsContent>

//               <TabsContent value="events" className="mt-4">
//                 <div className="space-y-1">
//                   {NOTIFICATIONS.filter((n) => n.type === "event").map((notification) => (
//                     <div
//                       key={notification.id}
//                       className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
//                     >
//                       <Avatar className="h-10 w-10">
//                         <AvatarImage src={notification.user.avatar} />
//                         <AvatarFallback>{notification.user.name.charAt(0).toUpperCase()}</AvatarFallback>
//                       </Avatar>

//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm">
//                           <span className="font-medium">{notification.user.name}</span> {notification.content}
//                         </p>
//                         <p className="text-xs text-muted-foreground">{notification.time}</p>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4 text-purple-500" />
//                         <Button size="sm" variant="outline" className="text-xs h-8">
//                           View
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }


// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import { BACKEND_URL } from "../../config";
// // // ... other imports

// // export default function NotificationsPage({ openCreateModal }: NotificationsPageProps) {
// //   const [loading, setLoading] = useState(true);
// //   const [notifications, setNotifications] = useState([]);
// //   const isMobile = useMediaQuery("(max-width: 768px)");

// //   useEffect(() => {
// //     const fetchNotifications = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         if (!token) {
// //           console.error("JWT token missing!");
// //           setLoading(false);
// //           return;
// //         }
  
// //         const res = await axios.get(`${BACKEND_URL}/api/v1/notification`, {
// //           headers: {
// //             "Authorization": `Bearer ${token.trim()}`,
// //           },
// //         });
  
// //         setNotifications(res.data.notifications);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error("Error fetching notifications:", error);
// //         setLoading(false);
// //       }
// //     };
  
// //     fetchNotifications();
// //   }, []);

// //   // Function to render notification icon remains the same
// //   const renderNotificationIcon = (type: string) => {
// //     switch (type) {
// //       case "like":
// //         return <Heart className="h-4 w-4 text-red-500" />;
// //       case "comment":
// //         return <MessageCircle className="h-4 w-4 text-blue-500" />;
// //       case "follow":
// //         return <UserPlus className="h-4 w-4 text-green-500" />;
// //       case "event":
// //         return <Calendar className="h-4 w-4 text-purple-500" />;
// //       case "story_verification":
// //         return <CheckCircle className="h-4 w-4 text-orange-500" />;
// //       default:
// //         return <Heart className="h-4 w-4 text-muted-foreground" />;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-background">
// //       {isMobile && <MobileNav openCreateModal={openCreateModal} />}
// //       <div className="flex">
// //         <div className="hidden md:block w-16 lg:w-64 fixed h-screen">
// //           <Sidebar openCreateModal={openCreateModal} />
// //         </div>
// //         <main className="flex-1 md:ml-16 lg:ml-64 pb-16 md:pb-8">
// //           <div className="max-w-2xl mx-auto p-4">
// //             <h1 className="text-2xl font-bold mb-6">Notifications</h1>
// //             {loading ? (
// //               <div className="space-y-4">
// //                 {Array(5)
// //                   .fill(0)
// //                   .map((_, index) => (
// //                     <div key={index} className="flex items-center gap-3 p-3 rounded-lg">
// //                       <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
// //                       <div className="flex-1 space-y-2">
// //                         <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
// //                         <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
// //                       </div>
// //                     </div>
// //                   ))}
// //               </div>
// //             ) : (
// //               <div>
// //                 {/* Render notifications fetched from backend */}
// //                 {notifications.map((notification: any) => (
// //                   <div
// //                     key={notification.id}
// //                     className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
// //                   >
// //                     <Avatar className="h-10 w-10">
// //                       <AvatarImage src={notification.sender?.avatar || "/placeholder.svg"} />
// //                       <AvatarFallback>{notification.sender?.name?.charAt(0).toUpperCase()}</AvatarFallback>
// //                     </Avatar>
// //                     <div className="flex-1 min-w-0">
// //                       <p className="text-sm">
// //                         <span className="font-medium">{notification.sender?.name}</span> {notification.message}
// //                       </p>
// //                       <p className="text-xs text-muted-foreground">
// //                         {new Date(notification.createdAt).toLocaleString()}
// //                       </p>
// //                     </div>
// //                     <div className="flex items-center gap-2">
// //                       {renderNotificationIcon(notification.type)}
// //                       {notification.postPreview && (
// //                         <div className="h-10 w-10 rounded-md overflow-hidden">
// //                           <img
// //                             src={notification.postPreview || "/placeholder.svg"}
// //                             alt="Post preview"
// //                             className="h-full w-full object-cover"
// //                           />
// //                         </div>
// //                       )}
// //                       {notification.type === "follow" && (
// //                         <Button size="sm" variant="outline" className="text-xs h-8">
// //                           Follow
// //                         </Button>
// //                       )}
// //                       {notification.type === "event" && (
// //                         <Button size="sm" variant="outline" className="text-xs h-8">
// //                           View
// //                         </Button>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }
