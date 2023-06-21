import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"


	const ProfilePage = () => {
		const { userId } = useParams(); 
		return (
			<div className='profile-container'>
				<h2 className='profile-h2'>Profile</h2>

				<Link className="profile-links" to={`/profile/account/${userId}`}>Account</Link>

				<Link  className="profile-links" to={`/profile/orders/${userId}`}>View Orders</Link>
			</div>
		)
	}

	export default ProfilePage