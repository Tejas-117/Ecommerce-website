import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { StateContext } from '../../context/StateProvider';
import ConfirmOrderProducts from '../../components/ConfirmOrder/ConfirmOrderProducts';
import CheckoutSteps from '../../components/Checkout/CheckoutSteps/CheckoutSteps';
import './ConfirmOrder.css'

function ConfirmOrder() {
  const [state, dispatch] = useContext(StateContext);
  const { cart, user, shipping_info } = state;
  const navigate = useNavigate();

  let cost = roundToTwo(cart.reduce((sum, product) => (
    sum + (product.quantity * product.price)
  ), 0));

  const shippingCharges = (cost > 1500 || cost === 0) ? 0 : 200;
  const tax = roundToTwo(cost * 0.18)
  const total = roundToTwo(cost + shippingCharges + tax);
    
  async function handleClick(e){
    const order_info = {
      payment_status: 'not-paid',
      price: total,
      currency: 'INR'
    }

    const response = await fetch(`/api/v1/orders/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shipping_info, order_info, products: cart }),
    })

    const { error, data } = await response.json();
    console.log(error, data);

    if(!error){
      dispatch({ type: "update_order_info", payload: { order_info: { order_id: data.order_id, products: cart } } });
    }

    navigate("/payment");
  }

  // simple utility function to round prices
  function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
  }

  return (
    <div className='confirm_order_container'>
       <CheckoutSteps step={1} />
       
       <div className="shipping_info">
         <h2>Shipping Information: </h2>
         <p>Name: <span>{user.name}</span></p>
         <p>Phone: <span>{shipping_info.phone}</span></p>         
         <p>Address: <span>{shipping_info.address}</span></p>                  
         <p>City: <span>{shipping_info.city}</span></p>                  
         <p>State: <span>{shipping_info.state}</span></p>                  
         <p>Country: <span>{shipping_info.country}</span></p>                  
         <p>Pin-Code: <span>{shipping_info.pinCode}</span></p>                  
       </div>

       <div className="confirm_order_products_container">
         <h2>Cart Information</h2>
         {cart.map((product) => {
             return <ConfirmOrderProducts product={product} key={product.id} />
           })
         }
       </div>

       <div className="order_summary">
         <h2>Order Summary</h2>
         <p>SubTotal: ₹<span>{cost}</span></p>
         <p>Shipping charges: ₹<span>{shippingCharges}</span></p>
         <p>GST: ₹<span>{tax}</span></p>
         <p>Total: ₹<span>{total}</span></p>
         <button onClick={handleClick} disabled={!state.cart.length}>Proceed to payment</button>
       </div>
    </div>
  )
}

export default ConfirmOrder;
