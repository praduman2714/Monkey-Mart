import {  createContext, useState , useContext, useEffect } from "react";
import { onAuthStateChanged , signOut} from 'firebase/auth';
import { ref, push, set , get , remove } from 'firebase/database';

import { auth , database} from './firebaseinit';

// importing Toast 
import { toast } from "react-toastify";

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
            // toast.success("Logged Out !");
            //console.log('User is signed out');
          }
        });
    
        // Clean up the listener when the component unmounts
        return () => unsubscribe();
      }, []);

      

      const handleLogout = () => {
        signOut(auth)
          .then(() => {
            // Logout successful
            toast.success('User Logged Out Successfully !')
           // console.log('User logged out successfully');
          })
          .catch((error) => {
            // An error occurred during logout
            toast.error("Error logging Out");
            console.error('Error logging out:', error);
          });
      };
    

    const toggleSignUp = ()=> {
        // console.log("Clicked");
        setSignUp(!signUp);
    }

    async function purchase() {
      try {
        const userId = 'user_uid'; // Replace 'user_uid' with the actual UID
    
        const ordersRef = ref(database, `userOrders/${userId}/orders`);
        const orderRef = ref(database, `userOrders/${userId}/order`);
        const cartRef = ref(database, `usersCarts/${userId}/myCart`);
        const cartTotalRef = ref(database, `usersCarts/${userId}/cartTotal`);
    
        const cartSnapshot = await get(cartRef);
        const cartTotalSnapshot = await get(cartTotalRef);
    
        if (cartSnapshot.exists() && cartTotalSnapshot.exists()) {
          const cartData = cartSnapshot.val();
          const cartItemsArray = Object.values(cartData);
          const cartTotalValue = cartTotalSnapshot.val();
    
          // Retrieve existing orders from the database
          const ordersSnapshot = await get(ordersRef);
          const existingOrders = ordersSnapshot.val();
    
          // Merge existing orders with new order data
          let newOrders = [];
          if (existingOrders) {
            newOrders = [...existingOrders];
          }
          newOrders.push({
            items: cartItemsArray,
            total: cartTotalValue,
            timestamp: Date.now(),
          });
    
          // Store the updated orders in the database
          await set(ordersRef, newOrders);
    
          // Assign cart items and total to order
          const orderData = {
            items: cartItemsArray,
            total: cartTotalValue,
          };
          await set(orderRef, orderData);
    
          // Remove cart items and reset cart total
          await remove(cartRef);
          await set(cartTotalRef, 0);
    
          // Reset local state
          setCartItem([]);
          setCartTotal(0);
    
          // Display success message or perform any other UI updates
          toast.success('Order Placed!');
        }
      } catch (error) {
        console.error('Error during purchase:', error);
      }
    }
    
    
    

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

              const updatedCartItems = cartItem.map((cartItem) => {
                if (cartItem.id === existingCartItem.id) {
                  return { ...cartItem, qty: updatedQty };
                }
                return cartItem;
              });

              setCartItem(updatedCartItems);
      
              // Calculate the updated cart total by adding the item price
              const updatedCartTotal = cartTotal + item.price;
      
              // Update the cart total in the database
              await set(ref(database, `usersCarts/${userId}/cartTotal`), updatedCartTotal);
              
              // toast messages
              toast.success("Item Count Increase !")
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

              toast.success("Item added to cart ! ");

                   
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
          const updatedCartTotal = cartTotal - (item.price * item.qty);
          const cartTotalRef = ref(database, `usersCarts/${userId}/cartTotal`);
          await set(cartTotalRef, updatedCartTotal);
      
          // Remove the item from the local cart state
          setCartItem((prevCartItems) =>
            prevCartItems.filter((cartItem) => cartItem.id !== cartItemId)
          );
          setCartTotal(updatedCartTotal);
          // toast messages
          toast.success("Item Removed from the Cart!");
        } catch (error) {
          console.error('Error removing item from cart:', error);
        }
    }
       
      
      

    // useEffect(()=>{
    //     removeFromCart();
    // }, [cartItem]);

    async function handleRemove(item) {
      try {
        const userId = 'user_uid';
        console.log(userId);
    
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
              // Remove the item from the local cart state
              setCartItem((prevCartItems) =>
              prevCartItems.filter((cartItem) => cartItem.id !== item.id)
              );
              toast.success("Item Removed from the Cart");
            } else {
              // Update the quantity of the existing item in the cart
              await set(
                ref(database, `usersCarts/${userId}/myCart/${existingCartItem.id}/qty`),
                updatedQty
              );
              toast.success("Item Descreased !");
    
              // Update the item quantity in the cartItem state
              const updatedCartItems = cartItem.map((cartItem) => {
                if (cartItem.id === existingCartItem.id) {
                  return { ...cartItem, qty: updatedQty };
                }
                return cartItem;
              });
              setCartItem(updatedCartItems);
            }
    
            const updatedCartTotal = cartTotal - item.price;
    
            await set(ref(database, `usersCarts/${userId}/cartTotal`), updatedCartTotal);
            setCartTotal(updatedCartTotal);
          }
        }
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    }
    
    
      

      

    return (
        <>
            <contextApi.Provider value={{signUp , toggleSignUp, cartItem, addToCart , isLoading , cartTotal
                                        , handleRemove , removeFromCart, orderItem, orderTotal, purchase,
                                        userPresent , handleLogout, setCartItem , setCartTotal , setOrderItem,
                                        setOrderTotal , setIsLoading}}>
                {children}
            </contextApi.Provider>
        </>
    )
}

export default CustomeContex;