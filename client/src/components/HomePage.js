import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import styled from "styled-components";
import image from "../components/assets/images/HeroPage.jpg";
import FeaturedProducts from "./Home/FeaturedProducts";
import CategoriesPage from "./Categories/CategoriesPage";
import Footer from "./Home/Footer";
import Loading from './Loading';

const HomePage = () => {
    const [user, setUser] = useContext(UserContext);
    const [isImageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const fetchCartData = async () => {
            if (user && user._id) {
                try {
                    const response = await axios.get(`/api/user/${user._id}/cart/data`);
                    const { shoppingCart } = response.data;
                    if (shoppingCart === null) {
                        try {
                            const response = await axios.post(`/api/user/${user._id}/cart/create`);
                            const { shoppingCart } = response.data;
                            setUser({ ...user, shoppingCart });
                        } catch (error) {
                            console.error(error);
                        }
                    } else {
                        setUser({ ...user, shoppingCart });
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    
        fetchCartData();
    
        // eslint-disable-next-line
    }, [user && user._id]);
    

    useEffect(() => {
        const img = new Image();
        img.src = image;
        img.onload = () => setImageLoaded(true);
    }, []);

    if (!isImageLoaded) {
        return <Loading />;
    } else {
        return (
        <>
            <HeroContainer aria-label="Hero section with welcome message">
                <div className="hero-introduction-text">
                    <h1>Welcome to Nile</h1>

                    <p>
                        Search though millions of books and have them sent right
                        to your doorstep
                    </p>
                </div>
            </HeroContainer>

            <CategoriesPage aria-label="Categories Page Section" />

            <FeaturedProducts aria-label="Section featuring selected books" />

            <Footer aria-label="Footer section" />
        </>
    );
        }
};

export default HomePage;

// I'm using styled-components here in order to more accurately show the full component when the image has loaded.

const HeroContainer = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* align-items: center; */
    width: 100%;
    height: 100vh;

    /* border: 3px solid red; */
    padding-top: 0rem !important;
    margin: 0 !important;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
        url(${image});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`;
