import React from 'react';
import { Link } from 'react-router-dom';

const CategoryBoxes = () => {
  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Categories</h2>
      <div className='category-container'>
        <Link to='/mystery' className='category-box-mystery'>
          <h2 className='category-box-title'>Mystery</h2>
        </Link>
        <Link to='/drama' className='category-box-drama'>
          <h2>Drama</h2>
        </Link>
        <Link to='/comedy' className='category-box-comedy'>
          <h2>Comedy</h2>
        </Link>
        <Link to='/romance' className='category-box-romance'>
          <h2>Romance</h2>
        </Link>
      </div>
    </>
  );
};

export default CategoryBoxes;
