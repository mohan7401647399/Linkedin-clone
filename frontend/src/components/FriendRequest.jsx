import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FriendRequest = ({ request }) => {
	const queryClient = useQueryClient();

	const { mutate: acceptConnectionRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "Error accepting request");
		},
	});

	const { mutate: rejectConnectionRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "Error rejecting request");
		},
	});

	const sender = request?.sender;

	if (!sender) {
		return (
			<div className="bg-red-100 text-red-700 p-4 rounded">
				Invalid request: sender info missing.
			</div>
		);
	}

	return (
		<div className='bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md'>
			<div className='flex items-center gap-4'>
				<Link to={ `/profile/${sender.username}` }>
					<img
						src={ sender.profilePicture || "/avatar.png" }
						alt={ sender.name || "User" }
						className='w-16 h-16 rounded-full object-cover'
					/>
				</Link>

				<div>
					<Link to={ `/profile/${sender.username}` } className='font-semibold text-lg'>
						{ sender.name || "Unknown User" }
					</Link>
					<p className='text-gray-600'>{ sender.headline || "No headline provided" }</p>
				</div>
			</div>

			<div className='space-x-2'>
				<button
					className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors'
					onClick={ () => acceptConnectionRequest(request._id) }
				>
					Accept
				</button>
				<button
					className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors'
					onClick={ () => rejectConnectionRequest(request._id) }
				>
					Reject
				</button>
			</div>
		</div>
	);
};

export default FriendRequest;
