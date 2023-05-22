import {  createContext, useState , useContext, useEffect } from "react";

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

    function addToCart(item){
        let ind = cartItem.findIndex((cart) => cart.id === item.id);

        if(ind === -1){
            setIsLoading(true);
            setCartItem([...cartItem , {...item , qty : 1}]);
            console.log("clicked");
            setCartTotal(cartTotal + item.price);
            setIsLoading(false);
        }else{
            cartItem[ind].qty++;
            setCartTotal(item.price + cartTotal);
            setCartItem(cartItem);

        }
        
    }

    function removeFromCart(item){
        let ind = cartItem.findIndex((cart) => cart.id === item.id);

        if(ind !== -1){
            const updatedCart = [...cartItem];
            setCartTotal(cartTotal - cartItem[ind].price * cartItem[ind].qty);
            updatedCart.splice(ind, 1);
            setCartItem(updatedCart);
        }
       // cartItem.splice(ind, 1);
        
        console.log("cliccked on removed Cart button");
    }

    useEffect(()=>{
        // removeFromCart();
    }, [cartItem]);

    function handleRemove(item){
        let ind = cartItem.findIndex((cart) => cart.id === item.id);
        if(ind !== -1){
            cartItem[ind].qty--;
            setCartTotal(cartTotal - item.price);
            if(cartItem[ind].qty === 0){
                cartItem.splice(ind, 1);
            }
            setCartItem(cartItem);
        }
    }

    return (
        <>
            <contextApi.Provider value={{signUp , toggleSignUp, cartItem, addToCart , isLoading , cartTotal
                                        , handleRemove , removeFromCart, orderItem, orderTotal, purchase}}>
                {children}
            </contextApi.Provider>
        </>
    )
}

export default CustomeContex;