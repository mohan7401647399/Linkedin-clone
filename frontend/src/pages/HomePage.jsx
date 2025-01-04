import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import Sidebar from "../components/Sidebar.jsx"
import PostCreation from "../components/PostCreation.jsx"

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

  console.log(authUser, recommendedUsers, posts)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={ authUser } />
      </div>
      <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
        <PostCreation user={ authUser } />
      </div>
    </div>
  )
}

export default HomePage
