import Style from './Home.module.css';

import Data from '../../data';
import { useValue } from '../../context';
function Home(){
    const {addToCart , isLoading} = useValue();
    return (
        <>
            <div className={Style.mainDiv}>
                {/* <input className={Style.searchBar} type='text' placeholder='Search' /> <br /> */}
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
                            <button onClick={() => addToCart(item)}>
                                {isLoading ? 'Adding' : 'Add To Cart'}
                            </button>
                          </div>
                        </>
                    ))}
                </div>
            </div>
        </>
    )
}
export default Home