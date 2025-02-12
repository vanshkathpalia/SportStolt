import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Post } from './pages/Post'
import { Posts } from './pages/Posts'
import { Home } from './pages/Home'
import { AddPost } from './pages/AddPost'
import { AddStory } from './pages/AddStory'
import { Profile } from './pages/Profile'
import { Explore } from './pages/Explore'
import { ApiPost } from './pages/ApiPost'
import { Events } from './pages/Events'
import AddEvent from './pages/AddEvent'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/post" element={<Posts/>} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/apipost/:id" element={<ApiPost />} />
          <Route path="/addstory" element={<AddStory />} />
          <Route path="/addpost" element={<AddPost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/events" element={<Events />} />
          <Route path="/addevent" element={<AddEvent />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
