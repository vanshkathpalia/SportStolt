"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

import { Home } from './pages/Home'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { ForgotPassword } from "./pages/ForgotPassword"
import { ResetPassword } from "./pages/ResetPassword"
import { PostsPage } from "./pages/Posts"
import { PostPage } from "./pages/Post"
import { CreatePostModal } from './components/models/CreatePostModal'
import { AppContextProvider } from "./context/AppProvider"
import { AddEvent } from "./pages/AddEvent"
import { Search } from './pages/Search'
import { EventsPage } from './pages/Events'
import NotificationsPage from './pages/Notification'
import { Training } from "./pages/Training"
import { NewsPage } from "./pages/News"
import { Profile } from './pages/Profile'
import { Logout } from "./pages/Logout"
import { EditProfile } from "./components/Profile/EditProfile"
import { SettingsPage } from "./pages/Settings"

import { AuthProvider } from './context/AuthProvider'  // You need to create/export this if not already
// import { useWatchedStories } from "./hooks/useWatchedStories"
import { WatchedStoriesProvider } from "./context/WatchedStoriesProvider"
import RefundPolicy from "./pages/RefundPolicy"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import ShippingPolicy from "./pages/ShippingPolicy"
import Contact from "./pages/Contact"
import { EarnPage } from "./pages/Earn"
import PaymentSuccessPage from "./pages/PaymentSuccess"
import WithdrawPage from "./pages/Withdraw"

const queryClient = new QueryClient()

function App() {
  // Consume the watched stories hook state so it initializes and stays reactive
  // useWatchedStories();

  const [createPostModalOpen, setCreatePostModalOpen] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WatchedStoriesProvider> 
          <AppContextProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/post" element={<PostsPage openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/post/:id" element={<PostPage openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/search" element={<Search openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/events" element={<EventsPage openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/addevent" element={<AddEvent openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/notifications" element={<NotificationsPage openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/training" element={<Training openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/news" element={<NewsPage openCreateModal={() => setCreatePostModalOpen(true)} />} />  
                <Route path="/profile" element={<Profile openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/profile/:username" element={<Profile openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/editprofile/:id" element={<EditProfile openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/settings" element={<SettingsPage openCreateModal={() => setCreatePostModalOpen(true)} />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/earn" element={<EarnPage/>} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/withdraw" element={<WithdrawPage />} />
                <Route path="/logout" element={<Logout />} />
              </Routes>

              <CreatePostModal isOpen={createPostModalOpen} onClose={() => setCreatePostModalOpen(false)} />
            
              </div>
            </Router>
          </AppContextProvider>
        </WatchedStoriesProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App



