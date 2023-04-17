import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function IndividualBook({ searchTerm }) {
    // const { id } = useParams();
    const [book, setBook] = useState(null);
    const [authors, setAuthors] = useState([]);
    const [firstPublishDate, setFirstPublishDate] = useState(null);
    const [description, setDescription] = useState("");
    const [cover, setCover] = useState(null);

    const MIN_PRICE = 5.0; // $5.00
    const MAX_PRICE = 20.0; // $20.00

    function calculateBookPrice(title) {
        const titleLength = title.length;
        const priceRange = MAX_PRICE - MIN_PRICE;
        const priceIncrement = priceRange / (100 * titleLength);
        const price = MIN_PRICE + priceIncrement * 100;
        return price.toFixed(2);
    }

    useEffect(() => {
        fetch(`https://openlibrary.org/search.json?title=${searchTerm}`)
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
    }, [searchTerm]);

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

    useEffect(() => {
        console.log(book);
        if (!book) {
            return; // book state has not been set yet
        } else {
            const url = `https://openlibrary.org/search.json?title=${book.title}`;
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    // Do something with the book data here
                    console.log(data);
                    setCover(data);
                })
                .catch((error) => {
                    // Handle any errors here
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

    useEffect(() => {
        console.log(`Book is :${book}`)
    }, [book])
 
    if (!book) {
        return <div style={{ color: "white" }}>Loading...</div>;
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
        </div>
    );
}

export default IndividualBook;
