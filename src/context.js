import {  createContext, useState , useContext, useEffect } from "react";
import { onAuthStateChanged , signOut} from 'firebase/auth';
import { ref, push, set , get , remove } from 'firebase/database';

import { auth , database} from './firebaseinit';

const contextApi = createContext();

export function useValue() {
    const value = useContext(contextApi);
    return value;
}

function CustomeContex({children}){

    const [signUp , setSignUp] = useState(true);
    const [cartItem, setCartItem] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cartTotal , setCartTotal] = useState(0);
    const [orderItem, setOrderItem] = useState([]);
    const [orderTotal, setOrderTotal] = useState(0);
    const [userPresent , setUserPresent] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in
            setUserPresent(true);
            
            // console.log('User is signed in:', user);
          } else {
            // User is signed out
            setUserPresent(false);
            console.log('User is signed out');
          }
        });
    
        // Clean up the listener when the component unmounts
        return () => unsubscribe();
      }, []);

      

      const handleLogout = () => {
        signOut(auth)
          .then(() => {
            // Logout successful
            console.log('User logged out successfully');
          })
          .catch((error) => {
            // An error occurred during logout
            console.error('Error logging out:', error);
          });
      };
    

    const toggleSignUp = ()=> {
        // console.log("Clicked");
        setSignUp(!signUp);
    }

    function purchase(){
        setOrderItem([...cartItem]);
        setCartItem([]);
        setOrderTotal(cartTotal);
        setCartTotal(0);
    }

    // function addToCart(item){
    //     let ind = cartItem.findIndex((cart) => cart.id === item.id);

    //     if(ind === -1){
    //         setIsLoading(true);
    //         setCartItem([...cartItem , {...item , qty : 1}]);
    //         console.log("clicked");
    //         setCartTotal(cartTotal + item.price);
    //         setIsLoading(false);
    //     }else{
    //         cartItem[ind].qty++;
    //         setCartTotal(item.price + cartTotal);
    //         setCartItem(cartItem);

    //     }
        
    // }

    async function addToCart(item) {
        try {
          setIsLoading(true);
          // Get the UID of the logged-in user
          const userId = 'user_uid'; // Replace 'user_uid' with the actual UID
      
          // Check if the item with the same title already exists in the user's cart
          const cartRef = ref(database, `usersCarts/${userId}/myCart`);
          const snapshot = await get(cartRef);
          const existingCartItems = snapshot.val();
      
          if (existingCartItems) {
            // Check if the item with the same title already exists in the cart
            const existingCartItem = Object.values(existingCartItems).find(
              (cartItem) => cartItem.title === item.title
            );
      
            if (existingCartItem) {
              // Item with the same title already exists in the cart, update the quantity
              const updatedQty = existingCartItem.qty + 1;
      
              // Update the quantity of the existing item in the cart
              await set(
                ref(database, `usersCarts/${userId}/myCart/${existingCartItem.id}/qty`),
                updatedQty
              );
      
              // Calculate the updated cart total by adding the item price
              const updatedCartTotal = cartTotal + item.price;
      
              // Update the cart total in the database
              await set(ref(database, `usersCarts/${userId}/cartTotal`), updatedCartTotal);
      
              // Update the cart total in the local state
              setCartTotal(updatedCartTotal);
            } else {
              // Item with the same title does not exist in the cart, add it as a new item
              // Create a new reference in the 'cart' path of the user's database
              const cartItemRef = push(ref(database, `usersCarts/${userId}/myCart`));
      
              // Generate a unique key for the item in the cart
              const itemId = cartItemRef.key;
      
              // Prepare the item data to be stored in the cart
              const itemData = {
                id: itemId,
                img: item.img,
                title: item.title,
                price: item.price,
                qty: 1,
              };
      
              // Calculate the updated cart total by adding the item price
              const updatedCartTotal = cartTotal + item.price;
      
              // Update the cart total in the database
              await set(ref(database, `usersCarts/${userId}/cartTotal`), updatedCartTotal);
      
              // Update the cart total in the local state
              setCartTotal(updatedCartTotal);
      
              // Store the item in the user's cart
              await set(ref(database, `usersCarts/${userId}/myCart/${itemId}`), itemData);
            }
          } else {
            // No existing items in the cart, add the item as a new item
            const cartItemRef = push(ref(database, `usersCarts/${userId}/myCart`));
      
            // Generate a unique key for the item in the cart
            const itemId = cartItemRef.key;
      
            // Prepare the item data to be stored in the cart
            const itemData = {
              id: itemId,
              img: item.img,
              title: item.title,
              price: item.price,
              qty: 1,
            };
      
            // Calculate the updated cart total by adding the item price
            const updatedCartTotal = cartTotal + item.price;
      
            // Update the cart total in the database
            await set(ref(database, `usersCarts/${userId}/cartTotal`), updatedCartTotal);
      
            // Update the cart total in the local state
            setCartTotal(updatedCartTotal);
      
            // Store the item in the user's cart
            await set(ref(database, `usersCarts/${userId}/myCart/${itemId}`), itemData);
          }
      
          // Item added to cart successfully
          console.log('Item added to cart:', item);
          setIsLoading(false);
        } catch (error) {
          // An error occurred while adding the item to the cart
          console.error('Error adding item to cart:', error);
        }
      }
      
      

    async function removeFromCart(item) {
        try {
          const userId = 'user_uid'; // Replace 'user_uid' with the actual UID
          const cartItemId = item.id; // Assuming the item object has an 'id' property
      
          const cartItemRef = ref(database, `usersCarts/${userId}/myCart/${cartItemId}`);
      
          await remove(cartItemRef);
      
          // Update the cart total by subtracting the item price
          const updatedCartTotal = cartTotal - item.price;
          const cartTotalRef = ref(database, `usersCarts/${userId}/cartTotal`);
          await set(cartTotalRef, updatedCartTotal);
      
          // Remove the item from the local cart state
          setCartItem((prevCartItems) =>
            prevCartItems.filter((cartItem) => cartItem.id !== cartItemId)
          );
          setCartTotal(updatedCartTotal);
        } catch (error) {
          console.error('Error removing item from cart:', error);
        }
    }
       
      
      

    // useEffect(()=>{
    //     removeFromCart();
    // }, [cartItem]);

    async function handleRemove(item) {
        try {
          const user = database.currentUser;
      
          if (user) {
            const userId = user.uid;
      
            const cartRef = ref(database, `usersCarts/${userId}/myCart`);
            const snapshot = await get(cartRef);
            const existingCartItems = snapshot.val();
      
            if (existingCartItems) {
              const existingCartItem = Object.values(existingCartItems).find(
                (cartItem) => cartItem.title === item.title
              );
      
              if (existingCartItem) {
                const updatedQty = existingCartItem.qty - 1;
      
                if (updatedQty === 0) {
                  // Quantity reaches zero, remove the item from the cart
                  await remove(
                    ref(database, `usersCarts/${userId}/myCart/${existingCartItem.id}`)
                  );
                } else {
                  // Update the quantity of the existing item in the cart
                  await set(
                    ref(database, `usersCarts/${userId}/myCart/${existingCartItem.id}/qty`),
                    updatedQty
                  );
                }
      
                // Calculate the updated cart total by subtracting the item price
                const updatedCartTotal = cartTotal - item.price;
      
                // Update the cart total in the database
                await set(ref(database, `usersCarts/${userId}/cartTotal`), updatedCartTotal);
      
                // Update the cart total in the local state
                setCartTotal(updatedCartTotal);
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      

      

    return (
        <>
            <contextApi.Provider value={{signUp , toggleSignUp, cartItem, addToCart , isLoading , cartTotal
                                        , handleRemove , removeFromCart, orderItem, orderTotal, purchase,
                                        userPresent , handleLogout, setCartItem , setCartTotal}}>
                {children}
            </contextApi.Provider>
        </>
    )
}

export default CustomeContex;