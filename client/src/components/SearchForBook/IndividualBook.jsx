import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Loading from "../Loading";

function IndividualBook() {
    const location = useLocation();
    const searchTerm = location.state?.searchTerm;
    const [book, setBook] = useState(null);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
    if (searchTerm) {
        setIsLoading(true);
        fetch(
            `https://openlibrary.org/search.json?title=${searchTerm}&page=${
                page + 1
            }&limit=20`
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setBook(data.docs || []);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setBook([]); 
                setIsLoading(false);
            });
        }
    }, [searchTerm, page]);


    const handleNextPage = () => {
        setPage(page + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePrevPage = () => {
        if (page > 0) {
            setPage(page - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (book && book.length === 0) {
        return <>
        <p className="missing-book-message">Sorry, but the book you searched for doesn't exist in our system.</p>
        <p className="missing-book-message-2">Try again with another book!</p>

        </>
    }

    // Filter books without an image cover. Wo don't want any books without a cover to be shown!
    const filteredBooks = book ? book.filter((bookItem) => bookItem.cover_i) : [];

    return (
        <>
            {filteredBooks.length === 0 ? (
                <p>Sorry, but the book you searched for doesn't exist in our system</p>
            ) : (
                <section className="book-container" aria-label="Book results">
                    <h2 className="book-results-for-h2">
                        Results for{" "}
                        <span className="search-term-results">
                            '{searchTerm}'
                        </span>
                    </h2>
                    <div className="book-grid" role="list">
                        {filteredBooks.map((bookItem, index) => (
                            <Link
                                to={`/books/works/${bookItem.key.replace(
                                    "/works/",
                                    ""
                                )}`}
                                className="book-card"
                                key={index}
                                role="listitem"
                            >
                                <div className="book-card-content">
                                    <img
                                        className="book-card-image"
                                        src={`https://covers.openlibrary.org/b/id/${bookItem.cover_i}-M.jpg`}
                                        alt="book cover"
                                    />
                                    <h3 className="book-card-title">
                                        {bookItem.title}
                                    </h3>
                                    <p className="book-card-author">
                                        {bookItem.author_name &&
                                            bookItem.author_name.join(", ")}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <nav
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "5rem",
                        }}
                        aria-label="Page navigation"
                    >
                        <button
                            className="individual-book-button"
                            onClick={handlePrevPage}
                            disabled={page === 0}
                            aria-label="Previous page"
                        >
                            Previous Page
                        </button>

                        <p style={{ color: "var(--grey-wood)" }}>
                            page: {page + 1}
                        </p>

                        <button
                            className="individual-book-button"
                            onClick={handleNextPage}
                            aria-label="Next page"
                        >
                            Next Page
                        </button>
                    </nav>
                </section>
            )}
        </>
    );
}

export default IndividualBook;
