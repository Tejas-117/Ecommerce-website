import React, { useContext, useState } from "react";
import "./Shipping.css";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PinDropIcon from "@mui/icons-material/PinDrop";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { StateContext } from "../../context/StateProvider";
import CheckoutSteps from "../../components/Checkout/CheckoutSteps/CheckoutSteps";

function Shipping() {
  const context = useContext(StateContext);
  const shippingAddress = context[0].shipping_info; //if already present in the local storage
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [state, setState] = useState(shippingAddress.state || "");
  const [pinCode, setPinCode] = useState(shippingAddress.pinCode || "");
  const [phone, setPhone] = useState(shippingAddress.phone || "");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (!address || !city || !country || !pinCode || !state) {
      setMessage("Please enter all necessary details");
      return;
    }

    const shipping = { address, phone, city, state, country, pinCode };

    // dispatch
    context[1]({
      type: "update_shipping_info",
      payload: { shipping },
    });

    navigate("/confirm-order");
  }

  return (
    <div className="shipping_container">
      <CheckoutSteps step={0} />

      <form className="shipping_form" onSubmit={handleSubmit}>
        <h1>Shipping Details</h1>
        <div>
          <HomeIcon />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <PhoneIcon />
          <input
            type="text"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d]+/g, '').slice(0, 10))}
          />
        </div>

        <div>
          <LocationCityIcon />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <PinDropIcon />
          <input
            type="text"
            placeholder="Pin Code"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value.replace(/[^\d]+/g, '').slice(0, 6))} //remove alphabets and special characters
          />
        </div>

        <div>
          <PublicIcon />

          <select value={country} onChange={(e) => setCountry(e.target.value)}> 
            <option value="">Country</option>
            {Country &&
              Country.getAllCountries().map((c) => (
                <option value={c.isoCode + ',' + c.name} key={c.isoCode}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        {country && (
          <div>
            <TransferWithinAStationIcon />

            <select value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">State</option>
              {State &&
                State.getStatesOfCountry(country.split(',')[0]).map((s) => (
                  <option value={s.isoCode + ',' + s.name} key={s.isoCode}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <button>Continue</button>
      </form>

      <div className="message_container">
        {message && (
          <div className="message">
            {message}
            <CloseIcon className="close" onClick={() => setMessage("")} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Shipping;
