import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";


export default function TestComponent() {
    const [user, setUser] = useContext(UserContext);

    console.log(user)
    return (
        <>
            <p>You should see the users information in the console, and below, meaning you now have the 'user' object available anywhere in your application (with the correct imports and setting up the useContext: see line 6) </p>
            <p>UserID: {user._id}</p>
            <p>Email: {user.email}</p>
        </>
    )
}