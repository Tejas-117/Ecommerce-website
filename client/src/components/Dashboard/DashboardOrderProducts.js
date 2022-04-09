import { Fragment, useState } from "react";
import "./DashboardOrderProducts.css";
import { formatDate } from "../../utils/FormatDate";

function DashboardOrderProducts({ products, currency, orderId, deliveryStatus, setMessage, resetMessage }) {
  const date = (formatDate(new Date())).split('-').reverse().join('-'); // to match input[type=date]
  const [shippingDate, setShippingDate] = useState(date);

  async function fulFillOrder(e){
    e.preventDefault();

    const response = await fetch(`/api/v1/orders/fulfill-order/${orderId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shippingDate })
    })

    const { data, error } = await response.json();

    if(error){
      setMessage("Couldn't fulfill order");
      resetMessage();
    }
    else{
      setMessage(data.message);
      resetMessage(true);
    }
  }

  return (
    <Fragment>
      {products.length === 0 && <h3>Products Not Found </h3>}

      {products?.map((product, idx) => (
        <div className="dashboard_order_product" key={idx}>
          <div className="dashboard_order_product_image_container">
            <img src={product.image_url} alt="product images" />
          </div>

          <div>
            <h4>{product.name}</h4>
            <p>
              Quantity: <span>{product.quantity}</span>
            </p>
            <p>
              Subtotal: <span>{currency + " " + product.subtotal}</span>
            </p>
          </div>
        </div>
      ))}

      {
        (products.length > 0 && deliveryStatus === 'processing') && (
         <form className="fulfill_order_form" onSubmit={fulFillOrder}>
           <label htmlFor="shipping_date">Shipping Date: </label>
           <input type="date" min={date.toString()} value={shippingDate} onChange={(e) => setShippingDate(e.target.value)}  required />

           <button>Fulfill Order</button>
         </form>
        )
      }
    </Fragment>
  );
}

export default DashboardOrderProducts;
