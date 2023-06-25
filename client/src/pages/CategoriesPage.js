import React from "react";
import { Link } from "react-router-dom";

const CategoryBoxes = () => {
    return (
        <section className="categories-page-container" aria-label="Categories Page">
            <h2 className="browse-by-categories">Browse by Categories</h2>
            <section className="category-container">
                <Link
                    to="/categories/mystery"
                    className="category-box category-box-mystery"
                    aria-label="Mystery Category"
                >
                    <h2 className="category-box-title">Mystery</h2>
                    <div className="slide-background">
                        <p className="slide-box-desc">
                            Unravel the hidden secrets and discover the unknown.
                            Dive into the depth of suspense and intrigue.
                        </p>
                    </div>
                </Link>
                <Link
                    to="/categories/drama"
                    className="category-box category-box-drama"
                    aria-label="Drama Category"
                >
                    <h2 className="category-box-title">Drama</h2>
                    <div className="slide-background">
                        <p className="slide-box-desc">
                            Explore intense emotions and compelling narratives.
                            Immerse yourself in the twists and turns of life's
                            drama.
                        </p>
                    </div>
                </Link>
                <Link
                    to="/categories/comedy"
                    className="category-box category-box-comedy"
                    aria-label="Comedy Category"
                >
                    <h2 className="category-box-title">Comedy</h2>
                    <div className="slide-background">
                        <p className="slide-box-desc">
                            Enjoy a light-hearted read full of laughter and joy.
                            Enter a world where humor rules.
                        </p>
                    </div>
                </Link>
                <Link
                    to="/categories/romance"
                    className="category-box category-box-romance"
                    aria-label="Romance Category"
                >
                    <h2 className="category-box-title">Romance</h2>
                    <div className="slide-background">
                        <p className="slide-box-desc">
                            Experience the thrill of love, passion, and
                            heart-warming stories. Begin your journey of
                            romantic escape.
                        </p>
                    </div>
                </Link>
            </section>
        </section>
    );
};

export default CategoryBoxes;
