import { useValue } from "../../context";
import Style from './Order.module.css';

function Order(){
    const {orderItem, orderTotal} = useValue();
    return (
        <>
            <h1>Your Order</h1>

            <div className={Style.tableClass}>
            <table>
                <thead>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>TotalPrice</th>
                </thead>
                
                {orderItem.map((item, index) =>(
                    <tbody key={index}>
                        <td>{item.title}</td>
                        <td> {item.price} </td>
                        <td> {item.qty}</td>
                        <td> {item.qty * item.price}</td>
                    </tbody>
                ))}
                <tfoot >
                <tr>
                    <td colspan="2"></td>
                    <td>Order Total:</td>
                    <td>{orderTotal}</td>
                </tr>
                </tfoot>
            </table>
            </div>
            

        </>
    )
}

export default Order;