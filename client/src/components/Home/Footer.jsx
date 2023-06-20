import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Visa from '../assets/images/visa.png'
import MasterCard from '../assets/images/mastercard.png'
import AmEx from '../assets/images/american-express.png'
import Discover from '../assets/images/discover.png'

import { FaUser } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-column">
                <p>Developer: Kedgard Cordero</p>
                {/* <a href="https://kenny4297.github.io/Website/" target="_blank" rel="noopener noreferrer">Profile</a> */}

                <a href="https://kenny4297.github.io/Website/" target="_blank" rel="noopener noreferrer">
                    <FaUser size={60} />
                </a>

                <a href="https://www.linkedin.com/in/kedgard-cordero/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={60} />
                </a>

                <a href="https://github.com/Kenny4297" target="_blank" rel="noopener noreferrer">
                    <FaGithub size={60} />
                </a>
            </div>
            <div className="footer-column">
                <p>About us</p>
                <p>Delivery Information</p>
                <p>Privacy Policy</p>
                <p>Terms and Conditions</p>
            </div>
            <div className="footer-column">
                <p>Secured payment gateways:</p>
                <div className="credit-card-columns">

                
                    <div>
                        <img src={Visa} alt="visa" />
                        <img src={MasterCard} alt="MC" />
                    </div>
                    <div>
                        <img src={AmEx} alt="AmEx" />
                        <img src={Discover} alt="Discover" />
                    </div>

                </div>

            </div>
        </footer>
    );
};

export default Footer;