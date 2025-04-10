import { Link } from "react-router-dom";

const UserCard = ({ user, isConnection }) => {
    const username = user?.username || user?.name || "unknown";
    const name = user?.name || "Unnamed User";
    const headline = user?.headline || "No headline provided";
    const profilePicture = user?.profilePicture || "/avatar.png";
    const connectionCount = user?.connections?.length || 0;

    return (
        <div className='bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md'>
            <Link to={ `/profile/${username}` } className='flex flex-col items-center'>
                <img
                    src={ profilePicture }
                    alt={ name }
                    className='w-24 h-24 rounded-full object-cover mb-4'
                />
                <h3 className='font-semibold text-lg text-center'>{ name }</h3>
            </Link>

            <p className='text-gray-600 text-center'>{ headline }</p>
            <p className='text-gray-500 text-sm mt-2'>{ connectionCount } Connection{ connectionCount !== 1 ? "s" : "" }</p>

            <button
                className='mt-4 px-4 py-2 rounded-md text-white bg-primary hover:bg-primary-dark transition-colors w-full disabled:opacity-50'
                disabled={ isConnection }
            >
                { isConnection ? "Connected" : "Connect" }
            </button>
        </div>
    );
};

export default UserCard;
