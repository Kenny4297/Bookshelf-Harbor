import React from 'react';
import { Link } from 'react-router-dom';

const CategoryBoxes = () => {
    return (
      <>
        <h2 style={{ textAlign: 'center' }}>Categories</h2>
        <div className='category-container'>
          <Link to='/categories/mystery' className='category-box category-box-mystery'>
            <h2 className='category-box-title'>Mystery</h2>
          </Link>
          <Link to='/categories/drama' className='category-box category-box-drama'>
            <h2 className='category-box-title'>Drama</h2>
          </Link>
          <Link to='/categories/comedy' className='category-box category-box-comedy'>
            <h2 className='category-box-title'>Comedy</h2>
          </Link>
          <Link to='/categories/romance' className='category-box category-box-romance'>
            <h2 className='category-box-title'>Romance</h2>
          </Link>
        </div>
      </>
    );
  };

export default CategoryBoxes;
