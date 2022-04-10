import React, { useContext, useEffect, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import "./PaymentForm.css";
import { StateContext } from "../../../context/StateProvider";
import { useNavigate } from "react-router-dom";

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [state, dispatch] = useContext(StateContext);
  const navigate = useNavigate();

  const { shipping_info, user } = state;

  // create shipping address
  const shipping = {
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

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setisLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${process.env.APP_URL}/orders`,
        payment_method_data: {
          billing_details: shipping, //billing address is same as shipping address
        },
      },
    });
    
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error"){
        setMessage(error.message);
      } 
      else {
        setMessage("An unexpected error occured.");
      }
    }

    if(paymentIntent?.status === 'succeeded'){
      const { order_id } = state.order_info;

      fetch(`/api/v1/orders/update-payment-status/${order_id}`, { method: "PATCH", credentials: "include" })
        .then(res => res.json())
        .then(data => {
          dispatch({ type: "reset_state" });
          
          // delete cart and shipping address from localstorage after placing a order succesfully
          localStorage.removeItem("cart");
          localStorage.removeItem("shipping");
          localStorage.removeItem("order_info");
        })
        .catch(err => {
          setMessage("Error occured while updating payment status of the order");
        });
        
      navigate("/orders", { replace: true });
    }

    setisLoading(false);
  }

  return (
    <div className="payment_form_container">
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit_payment"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>

        {message && <div id="payment-message">{message}</div>}
      </form>
    </div>
  );
}

export default PaymentForm;
