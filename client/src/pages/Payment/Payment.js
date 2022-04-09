import React, { useContext, useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { StateContext } from "../../context/StateProvider";
import CheckoutSteps from "../../components/Checkout/CheckoutSteps/CheckoutSteps";
import PaymentForm from "../../components/Checkout/Payment/PaymentForm";

function Payment({ stripeKey }) {
  const [message, setMessage] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [state, dispatch] = useContext(StateContext);

  // shipping format for creating payment intent
  const { user, shipping_info, order_info } = state;
  let shipping;

  if (shipping_info) {
    shipping = {
      address: {
        line1: shipping_info.address,
        city: shipping_info.city,
        state: shipping_info.state,
        country: shipping_info.country,
        postal_code: shipping_info.pinCode,
      },
      name: user.name,
      phone: shipping_info.phone,
    };
  }

  async function getClientSecret() {
    const response = await fetch("/api/v1/payment/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: state.cart,
        currency: "inr",
        shipping,
        order_id: order_info.order_id,
      }),
      credentials: "include",
    });

    const { clientSecret, error } = await response.json();

    if (error) {
      setMessage(error.message);
    }

    setClientSecret(clientSecret);
  }

  useEffect(() => {
    if (order_info.order_id) {
      getClientSecret();
    } 
    else {
      setMessage("Order confirmation required");
    }
  }, []);

  const options = {
    clientSecret,
    appearance: { theme: "stripe" },
  };

  return (
    <div style={{ marginTop: "70px" }}>
      <CheckoutSteps step={2} />

      {clientSecret ? (
        <Elements stripe={loadStripe(stripeKey)} options={options}>
          <PaymentForm />
        </Elements>
      ) : (
        ""
      )}

      <div className="message_container">
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default Payment;
