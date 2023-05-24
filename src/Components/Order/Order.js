import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { useValue } from '../../context';
import { database } from '../../firebaseinit';
import Style from './Order.module.css';

function Order() {
  const { orderItem, setOrderItem, orderTotal , setOrderTotal , isLoading , setIsLoading } = useValue();
  const [date, setDate] = useState(null);

  useEffect(() => {
    const userId = 'user_uid'; // Replace 'user_uid' with the actual UID

    const orderRef = ref(database, `userOrders/${userId}/orders`);
    const fetchOrderData = async () => {
      try {
        const orderSnapshot = await get(orderRef);

        if (orderSnapshot.exists()) {
          const orderData = orderSnapshot.val();
          console.log(orderData);
          // const { items, total , date} = orderData;

          // const currentDate = new Date(Date.now());

          //   const year = currentDate.getFullYear();
          //   const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
          //   const dates = currentDate.getDate();

          // Set order items and total in the local state
          setOrderItem(orderData);
          // setOrderTotal(total);
          // setDate(`${dates}/ ${month} / ${year}`);
        } else {
          // No order data found
          setOrderItem([]);
          setOrderTotal(0);
          setDate(null);
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  function changeToData(data){
    const currentDate = data.timestamp;
    console.log(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    const dates = currentDate.getDate();

    return (`${dates}/ ${month} / ${year}`);
  }
//   console.log(date);

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  return (
    <>
      {orderItem.map((data , index) => (
        
        <div key={index}>
          <h2> Ordered On :  {()=>changeToData(data)} </h2>
          <div className={Style.tableClass}>
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
