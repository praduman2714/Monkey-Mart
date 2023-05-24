// importing Style
import Style from './Cart.module.css';
// importing Hooks
import { useEffect } from 'react';
// Importing dependencies for Firebase Database CRUD opetaion
import { ref, get } from 'firebase/database';
import { useValue } from '../../context';
import { database , auth} from '../../firebaseinit';

// importing Link tag from react-router-dom
import { Link } from 'react-router-dom';

// Importing Spinner
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';

function Cart(){

    const {cartItem,
       setCartItem,
        setCartTotal,  
        cartTotal , 
        addToCart , 
        handleRemove,
        removeFromCart ,
        purchase, 
        isLoading,
        setIsLoading} = useValue();

    // Fetching data from Database on Cart Monunt

    useEffect(() => {
        
      const userId = auth.currentUser.uid; // current UserID
      
        const cartRef = ref(database, `usersCarts/${userId}/myCart`);
        const cartTotalRef = ref(database, `usersCarts/${userId}/cartTotal`);
      
        const fetchCartData = async () => {
          setIsLoading(true);
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
            toast.error('Error ! ');
            // console.error(error);
          }
          setIsLoading(false);
        };

        
      
        fetchCartData();

       
      
        // Cleanup the listener when the component is unmounted
        return () => {
          // No cleanup needed for this case
        };
    }, []);

    
    // for displyng the Loader
    if(isLoading){
      return <Loader />
    }

      // For displing if there in no element in Cart
    if(!isLoading && cartItem.length === 0){
      return <h1>No Item In Cart ! </h1>
    }
    
    // REndering UI
    return (
        <>
          {isLoading && <Loader /> }
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