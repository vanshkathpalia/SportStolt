"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Home } from './pages/Home'
// import { AddStory } from './pages/AddStory'
import { Profile } from './pages/Profile'
import { Search } from './pages/Search'
import { EventsPage } from './pages/Events'
import NotificationsPage from './pages/NotificationPage'
import { CreatePostModal } from './components/models/CreatePostModal'


import { AppContextProvider } from "./context/AppContext"
// import e from "express"
import { useState } from "react"
import { PostsPage } from "./pages/Posts"
import { PostPage } from "./pages/Post"
import { AddEvent } from "./pages/AddEvent"
import { Logout } from "./pages/Logout"; // adjust path
import { Training } from "./pages/Training"




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
              <Route path="/profile" element={<Profile openCreateModal={() => setCreatePostModalOpen(true)}/>} />
              <Route path="/search" element={<Search openCreateModal={() => setCreatePostModalOpen(true)} />} />
              <Route path="/events" element={<EventsPage openCreateModal={() => setCreatePostModalOpen(true)} />} />
              <Route path="/addevent" element={<AddEvent openCreateModal={() => setCreatePostModalOpen(true)} />} />
              <Route path="/training" element={<Training openCreateModal={() => setCreatePostModalOpen(true)} />} />
              <Route path="/notifications"
                element={<NotificationsPage openCreateModal={() => setCreatePostModalOpen(true)} />}/>
              <Route path="/logout" element={<Logout />} />
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
