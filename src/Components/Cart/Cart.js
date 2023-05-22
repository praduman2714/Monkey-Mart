import Style from './Cart.module.css';

import { useValue } from '../../context';
import { Link } from 'react-router-dom';

function Cart(){
    const {cartItem, cartTotal , addToCart , handleRemove, removeFromCart , purchase} = useValue();

    console.log(cartItem);
    // let cartTotal = 0;
    // for(let total of cartItem){
    //     cartTotal += total.price;
    // }
    return (
        <>
            <div className={Style.mainDiv}>
                {/* <input className={Style.searchBar} type='text' placeholder='Search' /> <br /> */}
                <div className={Style.aside}>
                    <div className={Style.filter}>
                        <p>Price :- {cartTotal}</p>
                        <Link className= 'styleLink' to= '/order'>
                            <button onClick={purchase}>Pruchase</button>
                        </Link>
                    </div>
                </div>
                <div className={Style.main}>
                    {cartItem.map((item , index) =>(
                        <>
                          <div key = {index} className= {Style.itemDiv}>
                            <img src = {item.img} alt='Images' />
                            <h2>{item.title}</h2>
                            <div className={Style.buttonAndPrice}>
                                <h3>&#8377; {item.price}</h3>
                                <span>
                                    <button onClick={() => addToCart(item)} className={Style.radio}> + </button> &nbsp; &nbsp;
                                    {item.qty} &nbsp; &nbsp;
                                    <button onClick={() => handleRemove(item)} className={Style.radio}> - </button>
                                </span>
                            </div>
                            <button onClick={() => removeFromCart(item)} >Remove From Cart</button>
                          </div>
                        </>
                    ))}
                </div>
            </div>
        </>
    )
}
export default Cart