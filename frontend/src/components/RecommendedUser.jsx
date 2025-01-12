import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, UserCheck, UserPlus } from "lucide-react";

const RecommendedUser = ({ user }) => {
  const queryClient = useQueryClient();

  // Fetch connection status
  const { data: connectionStatus, isLoading } = useQuery({
    queryKey: ["connectionStatus", user._id],
    queryFn: () => axiosInstance.get(`/connections/status/${user._id}`).then((res) => res.data),
  });

  // Send connection request
  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
    onSuccess: () => {
      toast.success("Connection request sent successfully");
      queryClient.invalidateQueries(["connectionStatus", user._id]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send connection request.");
    },
  });

  // Accept connection request
  const { mutate: acceptRequest } = useMutation({
    mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request accepted");
      queryClient.invalidateQueries(["connectionStatus", user._id]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to accept connection request.");
    },
  });

  // Reject connection request
  const { mutate: rejectRequest } = useMutation({
    mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request rejected");
      queryClient.invalidateQueries(["connectionStatus", user._id]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to reject connection request.");
    },
  });

  // Handle button rendering based on connection status
  const renderButton = () => {
    if (isLoading) {
      return (
        <button className="px-3 py-1 rounded-full bg-gray-200 text-gray-500" disabled>
          Loading...
        </button>
      );
    }

    const status = connectionStatus?.status;

    switch (status) {
      case "pending":
        return (
          <button className="px-3 py-1 rounded-full bg-yellow-500 text-white flex items-center" disabled>
            <Clock size={16} className="mr-1" />
            Pending
          </button>
        );
      case "received":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => acceptRequest(connectionStatus.requestId)}
              className="rounded-full p-1 bg-green-500 hover:bg-green-600 text-white"
              aria-label="Accept Connection Request"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => rejectRequest(connectionStatus.requestId)}
              className="rounded-full p-1 bg-red-500 hover:bg-red-600 text-white"
              aria-label="Reject Connection Request"
            >
              <Check size={16} />
            </button>
          </div>
        );
      case "connected":
        return (
          <button className="px-3 py-1 rounded-full bg-green-500 text-white flex items-center" disabled>
            <UserCheck size={16} className="mr-1" />
            Connected
          </button>
        );
      default:
        return (
          <button
            onClick={handleConnect}
            className="px-3 py-1 rounded-full border border-primary text-primary hover:bg-primary hover:text-white flex items-center"
          >
            <UserPlus size={16} className="mr-1" />
            Connect
          </button>
        );
    }
  };

  // Handle connect action
  const handleConnect = () => {
    if (connectionStatus?.status === "not_connected") {
      sendConnectionRequest(user._id);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <Link to={`/profile/${user.name}`} className="flex items-center flex-grow">
        <img
          src={user.profilePicture || "/avatar.png"}
          className="w-12 h-12 rounded-full mr-4"
          alt={`${user.name}'s profile`}
        />
        <div>
          <h3 className="font-semibold text-sm">{user.name}</h3>
          <p className="text-xs text-info">{user.headline}</p>
        </div>
      </Link>
      {renderButton()}
    </div>
  );
};

export default RecommendedUser;
