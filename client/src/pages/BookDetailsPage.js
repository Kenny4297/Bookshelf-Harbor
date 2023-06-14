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
        // fetch(`https://openlibrary.org/works/${"/works/" + key}.json`)
        // fetch(`https://openlibrary.org${key}.json`)
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
        if (book && book.created) {
            const createdDate = new Date(book.created.value);
            const options = { month: "long", day: "numeric", year: "numeric" };
            const formattedDate = createdDate.toLocaleDateString(
                "en-US",
                options
            );
            setFirstPublishDate(formattedDate);
        }
    }, [book]);

    useEffect(() => {
        console.log(book);
        console.log(book?.authors);
        console.log(book?.authors[0]?.author?.key); // "/authors/OL21594A"

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

    // This useEffect is used for debugging purposes. It only runs when the component is mounted (the first time it is rendered) and if the user variable changes. 
    useEffect(() => {
        console.log(user);
    }, [user]);


    useEffect(() => {
        console.log(book);
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
        // create book object
        const bookToAdd = {
            title: book.title,
            author: authors.map(author => author.name),
            first_publish_year: new Date(firstPublishDate).getFullYear(),
            cover_i: cover.docs[0].cover_i,
            price: parseFloat(calculateBookPrice(book.title)),
            key: book.key,
            description: typeof description === "object"
                ? description.value.split("Contains:")[0].trim()
                : description,
        };

        console.log('addToCart bookDetails:', bookToAdd);
        console.log(user._id)
        
        axios.post(`/api/user/${user._id}/cart`, bookToAdd)
        .then(response => {
            console.log(response);
            axios.get(`/api/user/${user._id}`) // the url to get user by id
                .then(response => {
                    console.log(response.data); // the updated user data
                    setUser(response.data); // update your user state with the updated user data
                    alert('Book added to cart!');
                })
                .catch(error => {
                    console.error(error);
                    alert('There was an error fetching the updated user data.');
                });
        })
        .catch(error => {
            console.error(error);
            alert('There was an error adding the book to the cart.');
        });
    }

    return (
        <div>
            <h1>Book Details Page</h1>
            <h2>{book.title}</h2>
            <p>
                Author:{" "}
                {authors.length > 0 &&
                    authors.map((author, index) => (
                        <span key={author.key}>
                            {author.name}
                            {index < authors.length - 1 ? ", " : ""}
                        </span>
                    ))}
            </p>
            <p>Publication Date: {firstPublishDate}</p>
            <p>
                Description:{" "}
                {typeof description === "object"
                    ? description.value.split("Contains:")[0].trim()
                    : description}
            </p>
            <p>Book Price: ${calculateBookPrice(book.title)}</p>
            {cover ? (
                <img
                    className="d-block mx-auto"
                    src={`https://covers.openlibrary.org/b/id/${cover.docs[0].cover_i}-L.jpg`}
                    alt={`Cover for ${book.title}`}
                />
            ) : (
                <p>Loading cover image...</p>
            )}

            <button onClick={addToCart}>Add to Cart</button>
        </div>
    );
}

export default BookDetailsPage;
