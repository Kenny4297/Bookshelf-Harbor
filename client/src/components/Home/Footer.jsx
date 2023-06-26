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
            <section className="footer-column">
                <p className="footer-p">Developer: Kedgard Cordero</p>
                <a
                    href="https://kenny4297.github.io/Website/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Kedgard Cordero's website"
                >
                    <FaUser size={30} />
                </a>

                <a
                    href="https://www.linkedin.com/in/kedgard-cordero/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Kedgard Cordero's LinkedIn profile"
                >
                    <FaLinkedin size={30} />
                </a>

                <a
                    href="https://github.com/Kenny4297"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Kedgard Cordero's GitHub profile"
                >
                    <FaGithub size={30} />
                </a>
            </section>
            
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
