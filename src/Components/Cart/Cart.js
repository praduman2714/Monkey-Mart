import Style from './Cart.module.css';
import { useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { useValue } from '../../context';
import { database } from '../../firebaseinit';
import { Link } from 'react-router-dom';

function Cart(){
    const {cartItem, setCartItem, setCartTotal,  cartTotal , addToCart , handleRemove, removeFromCart , purchase} = useValue();

    

    useEffect(() => {
        const userId = 'user_uid'; // Replace 'user_uid' with the actual UID
      
        const cartRef = ref(database, `usersCarts/${userId}/myCart`);
        const cartTotalRef = ref(database, `usersCarts/${userId}/cartTotal`);
      
        const fetchCartData = async () => {
          try {
            const cartSnapshot = await get(cartRef);
            const cartTotalSnapshot = await get(cartTotalRef);
      
            if (cartSnapshot.exists() && cartTotalSnapshot.exists()) {
              const cartData = cartSnapshot.val();
              const cartItemsArray = Object.values(cartData);
              const cartTotalValue = cartTotalSnapshot.val();
      
              setCartItem(cartItemsArray);
              setCartTotal(cartTotalValue);
            } else {
              setCartItem([]);
              setCartTotal(0);
            }
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchCartData();
      
        // Cleanup the listener when the component is unmounted
        return () => {
          // No cleanup needed for this case
        };
    }, []);
      

      

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