import { Link } from "react-router-dom"

const UserCard = ({ user, isConnection }) => {
    return (
        <div className={ 'bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md' }>
            <Link to={ `profile/${user.name}` } className={ 'flex flex-col items-center' }>
                <img src={ user.profilePicture || '/avatar.png' } alt={ user.name } className={ 'w-24 h-24 rounded-full object-cover mb-4' } />
                <h3 className={ 'font-semibold text-lg text-center' }>{ user.name } </h3>
            </Link>
            <p className={ 'text-gray-600 text-center' }>{ user.headline } </p>
            <p className={ 'text-gray-500 text-sm mt-2' }>{ user.connections?.length } Connections </p>
            <button className={ 'mt-4 px-4 py-2 rounded-md text-white bg-primary hover:bg-primary-dark transition-colors w-full' }>
                {isConnection ? 'Connected' : 'Connect'}
            </button>
        </div>
    )
}

export default UserCard
