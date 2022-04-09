import React from "react";
import { Link } from "react-router-dom";
import "./PageNotFound.css";

function PageNotFound() {
  return (
    <div className="page_not_found">
      <h1>PageNotFound</h1>
      <Link to={'/'}>
        <div className="back_link">Back To Home</div>
      </Link>
    </div>
  );
}

export default PageNotFound;
