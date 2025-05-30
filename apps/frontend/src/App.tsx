"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
// import e from "express"

import { Home } from './pages/Home'
import { Signup } from './pages/Signup'
// import { SignupStep } from "./pages/SignupStep"
import { Signin } from './pages/Signin'
import { ForgotPassword } from "./pages/ForgotPassword"
import { ResetPassword } from "./pages/ResetPassword";
import { PostsPage } from "./pages/Posts"
import { PostPage } from "./pages/Post"
import { CreatePostModal } from './components/models/CreatePostModal'
// import { AddStory } from './pages/AddStory'
import { AppContextProvider } from "./context/AppProvider"
import { AddEvent } from "./pages/AddEvent"
import { Search } from './pages/Search'
import { EventsPage } from './pages/Events'
import NotificationsPage from './pages/Notification'
import { Training } from "./pages/Training"
import { NewsPage} from "./pages/News"
import { Profile } from './pages/Profile'
import { Logout } from "./pages/Logout"; 
import { EditProfile } from "./components/Profile/EditProfile"
import { SettingsPage } from "./pages/Settings"




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
                {/* <Route path="/signup/step" element={<SignupStep />} />  */}
                <Route path="/signin" element={<Signin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/post" element={<PostsPage openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/post/:id" element={<PostPage openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/search" element={<Search openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/events" element={<EventsPage openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/addevent" element={<AddEvent openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/notifications"
                  element={<NotificationsPage openCreateModal={() => setCreatePostModalOpen(true)} />}/>
                <Route path="/training" element={<Training openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/news" element={<NewsPage openCreateModal={() => setCreatePostModalOpen(true)} />} />  
                <Route path="/profile" element={<Profile openCreateModal={() => setCreatePostModalOpen(true)}/>} />
                <Route path="/profile/:username" element={<Profile openCreateModal={() => setCreatePostModalOpen(true)}/>} />
                <Route path="/editprofile/:id" element={<EditProfile openCreateModal={() => setCreatePostModalOpen(true)}/>} />
                <Route path="/settings" element={<SettingsPage />} />
                {/* <Route path="/addstory" element={<AddStory />} /> */}
                
                {/* Add Event Page */}
                <Route path="/logout" element={<Logout />} />   Settings
              </Routes>

              {/* Global Create Post Modal */}
              <CreatePostModal isOpen={createPostModalOpen} onClose={() => setCreatePostModalOpen(false)} />

              {/* Global Create Event Modal -> but i have planed it to be in event page only */}
              {/* <CreateEventModal isOpen={createEventModalOpen} onClose={() => setCreateEventModalOpen(false)} /> */}
              
            </div>
          </Router>
        </AppContextProvider>
    </QueryClientProvider>
    </>
  )
}

export default App