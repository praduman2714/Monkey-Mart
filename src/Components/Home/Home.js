import Style from './Home.module.css';



import data from '../../data';
import { useValue } from '../../context';
import { NavLink } from 'react-router-dom';
import { useRef, useState } from 'react';


function Home(){
    const {addToCart , isLoading, setIsLoading} = useValue();
    const searchRef = useRef();
    const [Data, setData] = useState(data);

    function handleSearch(event) {
        const searchString = event.target.value.toLowerCase();
        const newArray = data.filter(item => item.title.toLowerCase().startsWith(searchString));
        setData(newArray);
    }
      
      
      
      
    return (
        <>
            <input onChange={handleSearch} className={Style.searchBar} type='text' placeholder='Search' ref={searchRef} /> <br />
            <div className={Style.mainDiv}>
               
               
                <div className={Style.aside}>
                    <div className={Style.filter}>
                        <h4>Filter</h4>
                        <p>Price : </p>
                        <input type='range' min = "0"  max = "1000000" /><br/>
                        <p>Category</p>
                        <label>
                        <input
                            type="radio"
                            name="option"
                            value="men"
                            // checked={selectedOption === 'men'}
                            // onChange={handleOptionChange}
                            />
                            Men
                        </label>
                        <br />
                        <label>
                            <input
                            type="radio"
                            name="option"
                            value="women"
                            // checked={selectedOption === 'women'}
                            // onChange={handleOptionChange}
                            />
                            Women
                        </label>
                        <br />
                        <label>
                            <input
                            type="radio"
                            name="option"
                            value="sports"
                            // checked={selectedOption === 'sports'}
                            // onChange={handleOptionChange}
                            />
                            Sports
                        </label>
                        <br />
                        <label>
                            <input
                            type="radio"
                            name="option"
                            value="others"
                            // checked={selectedOption === 'others'}
                            // onChange={handleOptionChange}
                            />
                            Others
                        </label>
                        <br />

                    </div>
                </div>
                <div className={Style.main}>
                    {Data.map((item , index) =>(
                        <>
                          <div key={index} className= {Style.itemDiv}>
                            <img src = {item.img} alt='Images' />
                            <h2>{item.title}</h2>
                            <h3>{item.price}</h3>
                            <NavLink >
                                <button  onClick={() => addToCart(item)}>
                                    {isLoading ? 'Adding' : 'Add To Cart'}
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