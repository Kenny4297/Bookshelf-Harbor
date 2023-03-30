import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { TestComponent } from "../components";
import { Link } from "react-router-dom";


const HomePage = () => {
    const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        console.log(user);
    }, [user]);

    return (
        <>
            <h1>Home Page</h1>

            {!user ? (
                <p>The user is not logged in.</p>
            ) : (
                <>
                    <p>The user is logged in.</p>
                    <Link to="/test">Go to Test Component</Link>
                </>
            )}
        </>
    )
}

export default HomePage