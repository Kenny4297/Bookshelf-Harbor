import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCarousel from '../components/bookCarousel';

export default function BookDisplay() {
  const [mystery, setMystery] = useState([]);
  const [drama, setDrama] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [romance, setRomance] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseMystery = await axios.get(
          'https://openlibrary.org/subjects/mystery.json?limit=10'
        );
		console.log(responseMystery.data);
        setMystery(responseMystery.data.works);

        const responseDrama = await axios.get(
          'https://openlibrary.org/subjects/drama.json?limit=10'
        );
        setDrama(responseDrama.data.works);

        const responseComedy = await axios.get(
          'https://openlibrary.org/subjects/comedy.json?limit=10'
        );
        setComedy(responseComedy.data.works);

        const responseRomance = await axios.get(
          'https://openlibrary.org/subjects/romance.json?limit=10'
        );
        setRomance(responseRomance.data.works);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const getBook = (book) => {
    return book.title;
  };

  return (
    <div style={{height:'80rem'}}>
      <h2>Browse by Categories</h2>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: "20px" }}>
            <div style={{ width: '48%', border: '1px solid blue' }}>
              <h2 style={{ textAlign: 'center' }}>Mystery</h2>
              <BookCarousel books={mystery} />
            </div>
            <div style={{ width: '48%', border: '1px solid blue' }}>
              <h2 style={{ textAlign: 'center' }}>Drama</h2>
              <BookCarousel books={drama} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '48%', border: '1px solid blue' }}>
              <h2 style={{ textAlign: 'center' }}>Comedy</h2>
              <BookCarousel books={comedy} />
            </div>
            <div style={{ width: '48%', border: '1px solid blue' }}>
              <h2 style={{ textAlign: 'center' }}>Romance</h2>
              <BookCarousel books={romance} />
            </div>
          </div>
        </div>
      </div>
  );
}
