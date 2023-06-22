import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";

const BookDetailsPage = () => {
    const { key } = useParams();
    const [book, setBook] = useState(null);
    const [authors, setAuthors] = useState([]);
    const [firstPublishDate, setFirstPublishDate] = useState(null);
    const [description, setDescription] = useState("");
    const [cover, setCover] = useState(null);
    const [user, setUser] = useContext(UserContext);
    const [cartItems, setCartItems] = useState(user?.shoppingCart?.books || []);

    const MIN_PRICE = 5.0; // $5.00
    const MAX_PRICE = 20.0; // $20.00

    const calculateBookPrice = (title) => {
        const titleLength = title.length;
        const priceRange = MAX_PRICE - MIN_PRICE;
        const priceIncrement = priceRange / (100 * titleLength);
        const price = MIN_PRICE + priceIncrement * 100;
        return price.toFixed(2);
    }

    useEffect(() => {
        const url = key.startsWith("/works/") ? `https://openlibrary.org${key}.json` : `https://openlibrary.org/works/${key}.json`;
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data) {
                    setBook(data);
                }
            })
            .catch((error) => console.log(error));
    }, [key]);

    useEffect(() => {
        setCartItems(user?.shoppingCart?.books || []);
    }, [user]);

    useEffect(() => {
        if (book && book.created) {
            const createdDate = new Date(book.created.value);
            const options = { month: "long", day: "numeric", year: "numeric" };
            const formattedDate = createdDate.toLocaleDateString("en-US", options);
            setFirstPublishDate(formattedDate);
        }
    }, [book]);

    useEffect(() => {
        if (book && book.authors) {
            const fetchAuthor = (author) => {
                const authorKey = author.author.key;
                return fetch(`https://openlibrary.org${authorKey}.json`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                    .catch((error) => console.log(error));
            };

            Promise.all(book.authors.map(fetchAuthor))
                .then((authors) => {
                    setAuthors(authors.filter(Boolean));
                })
                .catch((error) => console.log(error));
        }
    }, [book]);

    useEffect(() => {
        if (book && book.description) {
            setDescription(book.description);
        }
    }, [book]);

    useEffect(() => {
        console.log(user);
    }, [user]);

    useEffect(() => {
        if (!book) {
            return;
        } else {
            const url = `https://openlibrary.org/search.json?title=${book.title}`;
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setCover(data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [book]);

    useEffect(() => {
        if (!cover) {
            return;
        } else {
            console.log(cover.docs[0].cover_i);
        }
    }, [cover]);

    if (!book) {
        return <div style={{ color: "white" }}>Loading...</div>;
    }

    const addToCart = () => {
        const bookToAdd = {
            title: book.title,
            author: authors.map(author => author.name),
            first_publish_year: new Date(firstPublishDate).getFullYear(),
            cover_i: cover.docs[0].cover_i,
            price: parseFloat(calculateBookPrice(book.title)),
            key: book.key.slice(7),
            description: typeof description === "object" ? description.value.split("Contains:")[0].trim() : description,
        };
        
        console.log('addToCart bookDetails:', bookToAdd);
        console.log(user._id);
        
        axios.post(`/api/user/${user._id}/cart`, bookToAdd)
        .then(response => {
            console.log(response);
            setCartItems(prevItems => [...prevItems, bookToAdd]);
            alert('Book added to cart!');
        })
        .catch(error => {
            console.error(error);
            alert('There was an error adding the book to the cart.');
        });
    }

    return (
        <div className="book-details-page-container">
            <h2 className="book-details-page-h2">{book.title}</h2>
            <p className="book-details-title">
                Author:{" "}
                {authors.length > 0 &&
                    authors.map((author, index) => (
                        <span className="individual-book-data-response" key={author.key}>
                            {author.name}
                            {index < authors.length - 1 ? ", " : ""}
                        </span>
                    ))}
            </p>
            <p className="book-details-title">Publication Date: <span className="individual-book-data-response">{firstPublishDate}</span></p>
            <p className="book-details-title">
                Description:{" "}<span className="individual-book-data-response">
                {typeof description === "object"
                    ? description.value.split("Contains:")[0].trim()
                    : description}</span>
            </p>
            <p className="book-details-title">Book Price: ${calculateBookPrice(book.title)}</p>
            {cover ? (
                <img
                    className="d-block mx-auto"
                    src={`https://covers.openlibrary.org/b/id/${cover.docs[0].cover_i}-L.jpg`}
                    alt={`Cover for ${book.title}`}
                />
            ) : (
                <p>Loading cover image...</p>
            )}

            <button className="individual-book-add-to-cart" onClick={addToCart}>Add to Cart</button>
        </div>
    );
}

export default BookDetailsPage;
