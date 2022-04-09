import React, { Fragment, useState } from "react";
import "./CheckoutSteps.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import PaidIcon from "@mui/icons-material/Paid";
import { Link } from "react-router-dom";

const activeSteps = {
   color: "red"
}

const activeLine = {
  borderColor: "red"
}

function CheckoutSteps(props) {
  const [active, setActive] = useState(props.step);
  const steps = [
    {
      label: "Shipping Details",
      icon: <LocalShippingIcon />,
      page: "/shipping"
    },
    {
      label: "Confirm Order",
      icon: <LibraryAddCheckIcon />,
      page: "/confirm-order"
    },
    {
      label: "Payment",
      icon: <PaidIcon />,
      page: "/payment"
    },
  ];

  return (
    <div className="steps_container">
      <hr className="horizontal_line"  style={active >= 1 ? activeLine : {}}/>
      <hr className="horizontal_line" style={active >= 2 ? activeLine : {}}/>
      
      {steps.map((step, idx) => {
        return (
            <span style={idx <= active ? activeSteps : {}} key={idx}>
              <span className="steps_icons">{step.icon}</span>
              <p>{step.label}</p>
            </span>
        );
      })}
    </div>
  );
}

export default CheckoutSteps;
