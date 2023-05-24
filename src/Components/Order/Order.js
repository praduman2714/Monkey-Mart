// importing Hook
import { useEffect } from 'react';

// importing dependencies for Database
import { ref, onValue } from 'firebase/database';
import { useValue } from '../../context';
import { auth, database } from '../../firebaseinit';

// importing Style
import Style from './Order.module.css';
// imporiting Loader
import Loader from '../Loader/Loader';


function Order() {
  const { orderItem, setOrderItem , setOrderTotal , isLoading , setIsLoading } = useValue();
  
  // This will fetch the data from the database, to disply the Orders
  useEffect(() => {
    const userId = auth.currentUser.uid; // current UserID
    // console.log(userId);

    const orderRef = ref(database, `userOrders/${userId}/orders`);

    const orderListener = onValue(orderRef, (snapshot) => {
      setIsLoading(true);

      if (snapshot.exists()) {
        const orderData = snapshot.val();
        // console.log(orderData);
        setOrderItem(orderData);
      } else {
        setOrderItem([]);
        setOrderTotal(0);
      }

      setIsLoading(false);
    });

    return () => {
      // Clean up the listener when the component unmounts
      orderListener();
    };
  }, []);

  function changeToData(currentDate){
    // const currentDate = data.timestamp;
    // console.log(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    const dates = currentDate.getDate();

    return (`${dates} / ${month} / ${year}`);
  }
//   console.log(date);

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  if (!isLoading && !orderItem.length)
  return <h1 style={{ textAlign: "center" }}>No Orders Found!</h1>;

  if(isLoading){
    return <Loader />
  }

  // The UI will render here
  return (
    <>
      
      
      <h1>Your Orders</h1>
      {/* Here I'm making table every entry of Database. */}
      {orderItem.map((data , index) => (
        
        <div key={index}>
          <h2> Ordered On :  {changeToData(new Date(data.timestamp))} </h2>
          <div className={Style.tableClass}>
            {/* Table */}
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>TotalPrice</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item.price}</td>
                    <td>{item.qty}</td>
                    <td>{item.qty * item.price}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2"></td>
                  <td>Order Total:</td>
                  <td>{data.total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ))}
    </>
  );
}

export default Order;
