import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"


	const ProfilePage = () => {
		const { userId } = useParams(); 
		return (
			<div style={{display:'flex', flexDirection:'column'}}>
				<h2>Profile</h2>
				<Link to={`/profile/account/${userId}`}>Account</Link>
				<Link to={`/profile/orders/${userId}`}>View Orders</Link>
			</div>
		)
	
	}

	export default ProfilePage