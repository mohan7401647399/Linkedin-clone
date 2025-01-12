import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const LoginForm = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const queryClient = useQueryClient()

    const { mutate: loginMutation, isLoading } = useMutation({
        mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
        },
        onError: (err) => {
            toast.error(err.response.data.message || "Something went wrong in login")
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        loginMutation({ username, password })
    }

    return (
        <form onSubmit={ handleSubmit } className="space-y-4 w-full max-w-md" >
            <input type="text" placeholder="Username" value={ username } onChange={ (e) => setUsername(e.target.value) } className="input input-bordered w-full max-w-xs" required />
            <input type="password" placeholder="Password" value={ password } onChange={ (e) => setPassword(e.target.value) } className="input input-bordered w-full max-w-xs" required />
            <button type="submit" className="btn btn-primary w-full max-w-xs">
                { isLoading ? <Loader className="size animate-spin" /> : "Login" }
            </button>
        </form>
    )
}

export default LoginForm
