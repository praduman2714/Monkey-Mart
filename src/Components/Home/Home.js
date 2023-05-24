// Importing Style
import Style from './Home.module.css';

// Importing some Dependencies
import data from '../../data';
import { useValue } from '../../context';
import { NavLink } from 'react-router-dom';
import { useRef, useState } from 'react';



function Home(){
    // Importing value from contex
    const {addToCart , isLoading} = useValue();
    const [priceRange, setPriceRange] = useState(0);
    // Useing SearchRef, for finding the value to be searched
    const searchRef = useRef();
    const [Data, setData] = useState(data);

    // function handleSearch, 
    // THis is the modified version as it search all the occuracne of the the searchedString in the title
    function handleSearch(event) {
        const searchString = event.target.value.toLowerCase();
        const newArray = data.filter(item => item.title.toLowerCase().includes(searchString));
        setData(newArray);
    }
     
    
    return (
        
        <>
            
            <input onChange={handleSearch} className={Style.searchBar} type='text' placeholder='Search' ref={searchRef} /> <br />
            <div className={Style.mainDiv}>
               
               
                <aside  className={Style.filterContainer }>
                    <h2>Filter</h2>
                    <form>
                        <label htmlFor="price">Price: {priceRange}</label> <br/>
                        <input
                        type="range"
                        id="price"
                        name="price"
                        min="1"
                        max="100000"
                        className={Style.priceRange}
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        step="10"
                        />
                        <h2>Category</h2>
                        <div className={Style.categoryContainer}>
                        <div className={Style.inputContainer}>
                            <input
                            type="checkbox"
                            id="mensFashion"
                            name="mensFashion"
                            // onChange={(e) =>
                            //     setCategories((prevCategories) => ({
                            //     ...prevCategories,
                            //     mensFashion: e.target.checked,
                            //     }))
                            // }
                            />
                            <label htmlFor="mensFashion">Men's Clothing</label>
                        </div>
                        <div className={Style.inputContainer}>
                            <input
                            type="checkbox"
                            id="womensFashion"
                            name="womensFashion"
                            // onChange={(e) =>
                            //     setCategories((prevCategories) => ({
                            //     ...prevCategories,
                            //     womensFashion: e.target.checked,
                            //     }))
                            // }
                            />
                            <label htmlFor="womensFashion">Women's Clothing</label>
                        </div>
                        <div className={Style.inputContainer}>
                            <input
                            type="checkbox"
                            id="jewelery"
                            name="jewelery"
                            // onChange={(e) =>
                            //     setCategories((prevCategories) => ({
                            //     ...prevCategories,
                            //     jewelery: e.target.checked,
                            //     }))
                            // }
                            />
                            <label htmlFor="jewelery">Jewelery</label>
                        </div>
                        <div className={Style.inputContainer}>
                            <input
                            type="checkbox"
                            id="electronics"
                            name="electronics"
                            // onChange={(e) =>
                            //     setCategories((prevCategories) => ({
                            //     ...prevCategories,
                            //     electronics: e.target.checked,
                            //     }))
                            // }
                            />
                            <label htmlFor="electronics">Electronics</label>
                        </div>
                        </div>
                    </form>
                    </aside>
                <div className={Style.main}>
                    {Data.map((item , index) =>(
                        <>
                          <div key={index} className= {Style.itemDiv}>
                            <img src = {item.img} alt='Images' />
                            <h2>{item.title}</h2>
                            <h3>₹ {item.price}</h3>
                            <NavLink >
                                <button disabled = {isLoading}  onClick={() => addToCart(item)}>
                                    Add To Cart
                                </button>
                            </NavLink>
                          </div>
                        </>
                    ))}
                </div>
            </div>
        </>
    )
}
export default Home