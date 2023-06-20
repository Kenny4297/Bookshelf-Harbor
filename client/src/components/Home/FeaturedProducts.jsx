import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FeaturedBooks = () => {
    const [bookSets, setBookSets] = useState([]);

    useEffect(() => {
        fetchRandomBooks();
    }, []);

    const fetchRandomBooks = async () => {
        try {
            const response = await axios.get('https://openlibrary.org/search.json?q=novel');
            if (response.data && response.data.docs) {
                const booksWithCovers = response.data.docs.filter(book => book.cover_i);
                const randomBooks = pickRandom(booksWithCovers, 50); // getting 50 books now
                const bookSets = chunk(randomBooks, 2); // grouping books into sets of 5
                setBookSets(bookSets);
            }
        } catch (error) {
            console.error("Error fetching data from OpenLibraryAPI", error);
        }
    };

    const pickRandom = (arr, n) => {
        const result = new Array(n);
        let len = arr.length;
        const taken = new Array(len);

        if (n > len)
            throw new RangeError("pickRandom: more elements taken than available");

        while (n--) {
            const x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    };

    const chunk = (array, size) => { 
        return array.reduce((chunks, item, i) => {
            if (i % size === 0) {
                chunks.push([item]);
            } else {
                chunks[chunks.length - 1].push(item);
            }
            return chunks;
        }, []);
    };

    return (
        <div className="featured-novels-container">
            <h2>Featured Novels</h2>
            {bookSets.length > 0 ? (
                <Carousel indicators={false} id="featured-books-carousel">
                    {bookSets.map((bookSet, idx) => (
                        <Carousel.Item key={idx}>
                            <div className="d-flex justify-content-around">
                                {bookSet.map((book) => (
                                    <Card key={book.key} className='featured-novels-card'>
                                        <Link to={`/books${book.key}`}>
                                            <Card.Img className='featured-novels-image' variant="top" src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} alt={`Cover for ${book.title}`} />
                                            <Card.Body className="featured-novels-text">
                                                <Card.Title className="featured-novel-book-title">{book.title}</Card.Title>
                                                <Card.Text className="featured-novel-author">{book.author_name && book.author_name.join(', ')}</Card.Text>
                                            </Card.Body>
                                        </Link>
                                    </Card>
                                ))}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <p>Loading...</p>
            )}
            </div>
        );

};

export default FeaturedBooks;
