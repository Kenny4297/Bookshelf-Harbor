import { Link, useParams } from "react-router-dom"

	const ProfilePage = () => {
		const { userId } = useParams(); 
		return (
			<section className='profile-container' aria-label="User Profile Section">
				<h2 className='profile-h2'>Profile</h2>

				<Link className="profile-links" to={`/profile/account/${userId}`} aria-label="Account Settings">Account</Link>

				<Link  className="profile-links" to={`/profile/orders/${userId}`} aria-label="Order Settings">View Orders</Link>
			</section>
		)
	}

	export default ProfilePage