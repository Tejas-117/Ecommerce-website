import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import {  Route, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer/Footer";
import Header from "./components/layout/Header/Header";
import { StateContext } from "./context/StateProvider";
import { RequireAuth, isLoggedIn, IsAdmin } from "./utils/RequireAuth";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import ShowProduct from "./pages/ShowProduct/ShowProduct";
import Cart from "./pages/Cart/Cart";
import Payment from "./pages/Payment/Payment";
import Shipping from "./pages/Shipping/Shipping";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import ConfirmOrder from "./pages/ConfirmOrder/ConfirmOrder";
import Orders from "./pages/Orders/Orders";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddProduct from "./components/AddProduct/AddProduct";
import EditProduct from "./components/EditProduct/EditProduct";

function App() {
  const [state, dispatch] = useContext(StateContext);
  const [stripeKey, setStripeKey] = useState("");

  async function getStripeKey() {
    const response = await fetch(`/api/v1/payment/publishable-key`);
    const { key } = await response.json();
    setStripeKey(key);
  }

  useEffect(() => {
    isLoggedIn().then((data) => {
      if (data.user) {
        dispatch({ type: "set_user", payload: { user: data.user } });
      }
    });
    getStripeKey();
  }, []);

  return (
      <div className="App">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:id" element={<ShowProduct />} />
          <Route
            path="/cart"
            element={
              <RequireAuth>
                <Cart />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <Orders />
              </RequireAuth>
            }
          />
          <Route
            path="/shipping"
            element={
              <RequireAuth>
                <Shipping />
              </RequireAuth>
            }
          />
          <Route
            path="/confirm-order"
            element={
              <RequireAuth>
                <ConfirmOrder />
              </RequireAuth>
            }
          />
          <Route
            path="/payment"
            element={
              <RequireAuth>
                <Payment stripeKey={stripeKey} />
              </RequireAuth>
            }
          />
          
          <Route
            path="/admin/dashboard"
            element={
              <IsAdmin>
                <Dashboard />
              </IsAdmin>
            }
          />
          
          <Route
            path="/admin/dashboard/add-product"
            element={
              <IsAdmin>
                <AddProduct />
              </IsAdmin>
            }
          />

          <Route
            path="/admin/dashboard/edit-product/:id"
            element={
              <IsAdmin>
                <EditProduct />
              </IsAdmin>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </div>
  );
}

export default App;
