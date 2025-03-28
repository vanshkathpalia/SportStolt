export const NOTIFICATIONS = [
    {
      id: 1,
      type: "like",
      user: {
        name: "emma_smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "liked your post",
      postPreview: "/placeholder.svg?height=40&width=40",
      time: "2m ago",
    },
    {
      id: 2,
      type: "follow",
      user: {
        name: "john.doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "started following you",
      time: "15m ago",
    },
    {
      id: 3,
      type: "comment",
      user: {
        name: "travel_guy",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: 'commented: "Great form on that jump shot!"',
      postPreview: "/placeholder.svg?height=40&width=40",
      time: "1h ago",
    },
    {
      id: 4,
      type: "story_verification",
      user: {
        name: "admin",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "requested verification for a story image",
      storyImage: "/placeholder.svg?height=40&width=40",
      time: "30m ago",
      isVerified: false, // Initial state, can be updated upon verification
    },
  ]
  