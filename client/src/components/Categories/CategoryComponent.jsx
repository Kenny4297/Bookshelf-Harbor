import React from 'react';
import BookComponent from './BookComponent';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';


const Category = () => {
  const { category } = useParams();
    const location = useLocation();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <BookComponent category={category} />
  );
};

export default Category;
