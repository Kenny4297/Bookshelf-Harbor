import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"


	const ProfilePage = () => {
		const { userId } = useParams(); 
		return (
			<div>
				<h2>Profile</h2>
				<Link to={`/profile/account/${userId}`}>Account</Link>
				{/* Add link to Orders */}

			</div>
		)
	
	}

	export default ProfilePage