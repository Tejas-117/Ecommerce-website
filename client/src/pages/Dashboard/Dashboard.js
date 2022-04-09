import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StateContext } from "../../context/StateProvider";
import "./Dashboard.css";
import ReactDOM from "react-dom";
import { DashboardProducts, DashboardOrders, DashboardUsers } from "../../components/Dashboard";
import CloseIcon from "@mui/icons-material/Close";

function Dashboard() {
  const [message, setMessage] = useState("");
  const [state, dispatch] = useContext(StateContext);
  const [content, setContent] = useState(sessionStorage.getItem("content") || "products");
  const [products, setProducts] = useState(null);
  const [orders, setOrders] = useState(null);
  const [users, setUsers] = useState(null);
  const location = useLocation();

  // get required data from server
  async function getData(url) {
    const response = await fetch(url);
    const { data, error } = await response.json();

    if (!error) return data;
  }

  async function renderContent() {
    const contentContainer = document.querySelector(".content");
    let data;

    switch (content) {
      case "products": {
        if (!products) {
          data = await getData("/api/v1/products/?pagination=false");
          setProducts(data.products);
        }

        ReactDOM.render(
          <DashboardProducts
            allProducts={products || data.products}
            setMessage={setMessage}
            resetMessage={resetMessage}
          />,
          contentContainer
        );
        break;
      }

      case "orders": {
        if (!orders) {
          data = await getData("/api/v1/orders/new");
          setOrders(data.orders);
        }

        ReactDOM.render(
          <DashboardOrders
            allOrders={orders || data.orders}
            setMessage={setMessage}
            resetMessage={resetMessage}
          />,
          contentContainer
        );
        break;
      }

      case "users": {
        if (!users) {
          data = await getData("/api/v1/users");
          setUsers(data.users);
        }

        ReactDOM.render(
          <DashboardUsers 
            allUsers={users || data.users}  
            setMessage={setMessage}
            resetMessage={resetMessage}
          />,
          contentContainer
        );
        break;
      }
    }
  }

  // remove message after 4s automatically
  function resetMessage(reload = false) {
    setTimeout(() => {
      setMessage("");
      if(reload){
        window.location.reload();
      }
    }, 4000);
  }

  // render content based on selected option
  useEffect(() => {
    sessionStorage.setItem("content", content);
    renderContent(); 

    // set active class to current content type
    const allListElts = document.querySelectorAll("[data-type]");
    allListElts.forEach(listElt => {
      listElt.classList.remove("active");

      if(content === listElt.dataset.type){
        listElt.classList.add("active");
      }
    });
  }, [content]);

  useEffect(() => {
    if(location.state){
      setMessage(location.state?.message || ""); // message from redirected page
      resetMessage();
    }
  }, []);

  return (
    <div className="dashboard">
      <div className="message_container dashboard_message_container">
        {message && (
          <div className="message">
            {message}
            <CloseIcon className="close" onClick={() => setMessage("")} />
          </div>
        )}
      </div>

      <div className="sub_header">
        <h1>Admin Dashboard</h1>
        <ul>
          <li data-type="products" onClick={(e) => setContent(e.target.dataset.type)}>
            Products
          </li>
          <li data-type="orders" onClick={(e) => setContent(e.target.dataset.type)}>
            Orders
          </li>
          <li data-type="users" onClick={(e) => setContent(e.target.dataset.type)}>
            Users
          </li>
        </ul>
      </div>

      <div className="content_container">
        <h2>{content}</h2>
        <div className="content"></div>
      </div>
    </div>
  );
}

export default Dashboard;
