import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";

/*
The 'featured books' will be stored in local storage due to the low amount of data and the absence of any personal information.
*/

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};

const FeaturedBooks = () => {
    const [books, setBooks] = useState([]);
    const windowSize = useWindowSize();

    useEffect(() => {
        fetchBooks(12);
    }, []);


    // Fetching the books for the FeaturedProducts component
    const fetchBooks = async (count) => {
        try {
            // Check if books are already stored in localStorage
            const storedBooks = localStorage.getItem("books");
            const storedDate = localStorage.getItem("booksDate");
            const currentDate = new Date().toISOString().split("T")[0]; // Get current date in "YYYY-MM-DD" format

            if (storedBooks && storedDate === currentDate) {
                setBooks(JSON.parse(storedBooks));
                return;
            }

            let books = [];
            let page = 1;
            while (books.length < count) {
                const response = await axios.get(
                    `https://openlibrary.org/search.json?q=novel&rows=${count}&page=${page}`
                );
                if (response.data && response.data.docs) {
                    const booksWithCovers = response.data.docs.filter(
                        (book) => book.cover_i
                    );
                    books = [...books, ...booksWithCovers];
                }
                page++;
            }
            // Store books data and current date in localStorage
            localStorage.setItem(
                "books",
                JSON.stringify(books.slice(0, count))
            );
            // We store the books in local storage so they don't have to be fetched again until tomorrow
            localStorage.setItem("booksDate", currentDate);
            setBooks(books.slice(0, count));
        } catch (error) {
            console.error("Error fetching data from OpenLibraryAPI", error);
        }
    };

    const carouselItems = [];
    let booksPerSlide;
    if (windowSize.width <= 630) {
        booksPerSlide = 1;
    } else if (windowSize.width <= 900) {
        booksPerSlide = 2;
    } else {
        booksPerSlide = 3;
    }
    
    for (let i = 0; i < books.length; i += booksPerSlide) {
        carouselItems.push(
            <Carousel.Item key={i}>
                <div className="d-flex justify-content-around flex-wrap">
                    {books.slice(i, i + booksPerSlide).map((book) => (
                        <Card key={book.key} className="featured-novels-card">
                            <Link to={`/books${book.key}`}>
                                <Card.Img
                                    className="featured-novels-image"
                                    variant="top"
                                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                                    alt={`Cover for ${book.title}`}
                                />
                                <Card.Body className="featured-novels-text">
                                    <h2 className="featured-novels-book-title">
                                        {book.title}
                                    </h2>
                                    <p className="featured-novels-author">
                                        {book.author_name[0]}
                                    </p>
                                </Card.Body>
                            </Link>
                        </Card>
                    ))}
                </div>
            </Carousel.Item>
        );
    }

    return (
        <section className="featured-novels-container">
            <h2 className="todays-featured-novels-h2" id="carousel-label">
                Today's Featured Novels
            </h2>
            {books.length > 0 ? (
                <Carousel
                    style={{ height: "30rem" }}
                    className="carousel-featured"
                    indicators={false}
                    nextIcon={
                        <HiArrowRight
                            size={30}
                            color="black"
                            aria-label="Next Novel"
                        />
                    }
                    prevIcon={
                        <HiArrowLeft
                            size={30}
                            color="black"
                            aria-label="Previous Novel"
                        />
                    }
                    aria-labelledby="carousel-label"
                >
                    {carouselItems}
                </Carousel>
            ) : (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <p>Awaiting OpenLibrary API...</p>
                </div>
            )}
        </section>
    );
};

export default FeaturedBooks;
