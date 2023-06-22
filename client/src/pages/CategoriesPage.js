import React from 'react';
import { Link } from 'react-router-dom';

const CategoryBoxes = () => {
    return (
      <div className="categories-page-container">
        <h2 className="browse-by-categories">Browse by Categories</h2>
        <div className='category-container'>
          <Link to='/categories/mystery' className='category-box category-box-mystery'>
            <h2 className='category-box-title'>Mystery</h2>
            <div className='slide-background'>
              <p className="slide-box-desc">Unravel the hidden secrets and discover the unknown. Dive into the depth of suspense and intrigue.</p>
            </div>
          </Link>
          <Link to='/categories/drama' className='category-box category-box-drama'>
            <h2 className='category-box-title'>Drama</h2>
            <div className='slide-background'>
              <p className="slide-box-desc">Explore intense emotions and compelling narratives. Immerse yourself in the twists and turns of life's drama.</p>
            </div>
          </Link>
          <Link to='/categories/comedy' className='category-box category-box-comedy'>
            <h2 className='category-box-title'>Comedy</h2>
            <div className='slide-background'>
              <p className="slide-box-desc">Enjoy a light-hearted read full of laughter and joy. Enter a world where humor rules.</p>
            </div>
          </Link>
          <Link to='/categories/romance' className='category-box category-box-romance'>
            <h2 className='category-box-title'>Romance</h2>
            <div className='slide-background'>
              <p className="slide-box-desc">Experience the thrill of love, passion, and heart-warming stories. Begin your journey of romantic escape.</p>
            </div>
          </Link>
        </div>
      </div>
    );
  };

export default CategoryBoxes;
