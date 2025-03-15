"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "../components/StickyBars/Sidebar"
import { MobileNav } from "../components/StickyBars/MobileNav"
import { useMediaQuery } from "../hooks/useMediaQuery"
import { Heart, MessageCircle, UserPlus, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

// Mock data
import { NOTIFICATIONS } from "../mockData/Notification"

// Group notifications by time
const TODAY_NOTIFICATIONS = NOTIFICATIONS.filter((n) => n.time.includes("ago") || n.time === "Today")
const EARLIER_NOTIFICATIONS = NOTIFICATIONS.filter((n) => n.time === "Yesterday" || n.time.includes("days"))

interface NotificationsPageProps {
  openCreateModal: () => void
}

export default function NotificationsPage({ openCreateModal }: NotificationsPageProps) {
  const [loading, setLoading] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")

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
      default:
        return <Heart className="h-4 w-4 text-muted-foreground" />
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

