import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import Sidebar from "../components/Sidebar.jsx"
import PostCreation from "../components/PostCreation.jsx"
import Post from "../components/Post.jsx"
import { Users } from "lucide-react"
import RecommendedUser from "../components/RecommendedUser.jsx"

const HomePage = () => {
  //  get user
  const { data: authUser } = useQuery({ queryKey: ["authUser"] })
  //  get recommended users
  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/suggestions")
      return response.data
    }
  })
  //  get posts
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await axiosInstance.get("/posts")
      return response.data
    }
  })

  console.log("authUser", authUser)
  console.log("recommendedUsers", recommendedUsers)
  console.log("posts", posts)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={ authUser } />
      </div>
      <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
        <PostCreation user={ authUser } />

        { posts?.map(post => <Post key={ post._id } post={ post } />) }
        {
          posts?.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="mb-6">
                <Users className="mx-auto text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">No Posts Yet here</h2>
              <p className="text-gray-600 mb-6">Connect with others to start seeing posts in your feed!</p>
            </div>
          )
        }
      </div>
      { recommendedUsers?.length > 0 && (
        <div className='col-span-1 lg:col-span-1 hidden lg:block'>
          <div className='bg-secondary rounded-lg shadow p-4'>
            <h2 className='font-semibold mb-4'>People you may know</h2>
            { recommendedUsers?.map((user) => (
              <RecommendedUser key={ user._id } user={ user } />
            )) }
          </div>
        </div>
      ) }
    </div>
  )
}

export default HomePage
