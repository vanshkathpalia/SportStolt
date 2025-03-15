"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Home } from './pages/Home'
import { AddPost } from './pages/AddPost'
import { AddStory } from './pages/AddStory'
import { Profile } from './pages/Profile'
import { Search } from './pages/Search'
// import { ApiPost } from './pages/ApiPost'
import { Events } from './pages/Events'
import AddEvent from './pages/AddEvent'
import NotificationsPage from './pages/NotificationPage'
import { CreatePostModal } from './components/models/CreatePostModal'

import { AppContextProvider } from "./context/AppContext"
// import e from "express"
import { useState } from "react"
import { PostsPage } from "./pages/Posts"
import { PostPage } from "./pages/Post"


const queryClient = new QueryClient()

function App() {
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false)
  // const [createEventModalOpen, setCreateEventModalOpen] = useState(false)

  return (
    <>
      <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/post" element={<PostsPage openCreateModal={() => setCreatePostModalOpen(true)} />} />
              <Route path="/post/:id" element={<PostPage openCreateModal={() => setCreatePostModalOpen(true)} />} />
              {/* <Route path="/apipost/:id" element={<ApiPost />} /> */}
              <Route path="/addstory" element={<AddStory />} />
              <Route path="/addpost" element={<AddPost />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<Search />} />
              <Route path="/events" element={<Events />} />
              <Route path="/addevent" element={<AddEvent />} />
              <Route path="/notifications"
                element={<NotificationsPage openCreateModal={() => setCreatePostModalOpen(true)} />}/>
            </Routes>

            {/* Global Create Post Modal */}
            <CreatePostModal isOpen={createPostModalOpen} onClose={() => setCreatePostModalOpen(false)} />

            {/* Global Create Event Modal */}
            {/* <CreateEventModal isOpen={createEventModalOpen} onClose={() => setCreateEventModalOpen(false)} /> */}
            
          </div>
        </Router>
      </AppContextProvider>
    </QueryClientProvider>
    </>
  )
}

export default App
