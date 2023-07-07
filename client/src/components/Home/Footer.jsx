import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Visa from "../assets/images/visa.png";
import MasterCard from "../assets/images/mastercard.png";
import AmEx from "../assets/images/american-express.png";
import Discover from "../assets/images/discover.png";

import { FaUser } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer-container">            
            <div className="footer-column-about-us">
                <p className="footer-p">About us</p>
                <p className="footer-p">Delivery Information</p>
                <p className="footer-p">Privacy Policy</p>
                <p className="footer-p">Terms and Conditions</p>
            </div>
            
            <div className="footer-column-credit-cards">
                <p className="footer-p secured-payments">
                    Secured payment gateways:
                </p>
                <div className="credit-card-columns" role="list">
                    <div role="listitem">
                        <img
                            className="footer-credit-card"
                            src={Visa}
                            alt="visa"
                        />
                        <img
                            className="footer-credit-card"
                            src={MasterCard}
                            alt="MasterCard"
                        />
                    </div>
                    <div role="listitem">
                        <img
                            className="footer-credit-card"
                            src={AmEx}
                            alt="American Express"
                        />
                        <img
                            className="footer-credit-card"
                            src={Discover}
                            alt="Discover"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
