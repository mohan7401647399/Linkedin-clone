import Layout from './components/layout/Layout'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import SignUp from './pages/auth/SignUp'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios'
import NotificationPage from './pages/NotificationPage'
import NetworkPage from './pages/NetworkPage'
import PostPage from './pages/PostPage'
import ProfilePage from './pages/ProfilePage'

function App() {

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/auth/getUser")
        return response.data
      } catch (error) {
        if (error.response && error.response.status === 401) return null
        toast.error(error.response.data.message || "Something went wrong in getting user")
      }
    }
  })
  if (isLoading) return null

  return (
    <Layout>
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <LoginPage /> } />
        <Route path="/signup" element={ !authUser ? <SignUp /> : <HomePage /> } />
        <Route path="/login" element={ !authUser ? <LoginPage /> : <HomePage /> } />
        <Route path="/notifications" element={ authUser ? <NotificationPage /> : <LoginPage /> } />
        <Route path="/network" element={ authUser ? <NetworkPage /> : <LoginPage /> } />
        <Route path="/post/:postId" element={ authUser ? <PostPage /> : <LoginPage /> } />
        <Route path="/profile/:username" element={ authUser ? <ProfilePage /> : <LoginPage /> } />
      </Routes>
      <Toaster />
    </Layout>
  )
}

export default App
