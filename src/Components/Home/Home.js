// Importing Style
import Style from './Home.module.css';

// Importing some Dependencies
import data from '../../data';
import { useValue } from '../../context';
import { NavLink } from 'react-router-dom';
import { useRef, useState } from 'react';

function Home() {
  // Importing value from context
  const { addToCart, isLoading } = useValue();
  const [priceRange, setPriceRange] = useState(0);
  const searchRef = useRef();
  const [filteredData, setFilteredData] = useState(data);

  // Function to handle search
  const handleSearch = () => {
    const searchString = searchRef.current.value.toLowerCase();
    const newArray = data.filter((item) => item.title.toLowerCase().includes(searchString));
    setFilteredData(newArray);
  };

  // Function to filter items based on the selected category
  const handleCategoryChange = (category) => {
    const newArray = data.filter((item) => item.category === category);
    setFilteredData(newArray);
  };

  // Function to filter items based on the selected price range
  const handlePriceRangeChange = (event) => {
    const selectedPriceRange = parseInt(event.target.value);
    const newArray = data.filter((item) => item.price <= selectedPriceRange);
    setPriceRange(selectedPriceRange);
    setFilteredData(newArray);
  };

  return (
    <>
      <input
        onChange={handleSearch}
        className={Style.searchBar}
        type="text"
        placeholder="Search"
        ref={searchRef}
      />
      <br />
      <div className={Style.mainDiv}>
        <aside className={Style.filterContainer}>
          <h2>Filter</h2>
          <form>
            <label htmlFor="price">Price: {priceRange}</label>
            <br />
            <input
              type="range"
              id="price"
              name="price"
              min="1"
              max="100000"
              className={Style.priceRange}
              value={priceRange}
              onChange={handlePriceRangeChange}
              step="10"
            />
            <h2>Category</h2>
            <div className={Style.categoryContainer}>
              <div className={Style.inputContainer}>
                <input
                  type="checkbox"
                  id="mensFashion"
                  name="mensFashion"
                  onChange={() => handleCategoryChange("Men")}
                />
                <label htmlFor="mensFashion">Men's Clothing</label>
              </div>
              <div className={Style.inputContainer}>
                <input
                  type="checkbox"
                  id="womensFashion"
                  name="womensFashion"
                  onChange={() => handleCategoryChange("Women")}
                />
                <label htmlFor="womensFashion">Women's Clothing</label>
              </div>
              <div className={Style.inputContainer}>
                <input
                  type="checkbox"
                  id="jewelry"
                  name="jewelry"
                  onChange={() => handleCategoryChange("Jwellery")}
                />
                <label htmlFor="jewelry">Jewelry</label>
              </div>
              <div className={Style.inputContainer}>
                <input
                  type="checkbox"
                  id="electronics"
                  name="electronics"
                  onChange={() => handleCategoryChange("Electronics")}
                />
                <label htmlFor="electronics">Electronics</label>
              </div>
            </div>
          </form>
        </aside>
        <div className={Style.main}>
          {filteredData.map((item, index) => (
            <div key={index} className={Style.itemDiv}>
              <img src={item.img} alt="Images" />
              <h2>{item.title}</h2>
              <h3>₹ {item.price}</h3>
              <NavLink>
                <button disabled={isLoading} onClick={() => addToCart(item)}>
                  Add To Cart
                </button>
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;