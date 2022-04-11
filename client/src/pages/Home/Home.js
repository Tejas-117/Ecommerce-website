import React, { Fragment, useEffect, useState } from "react";
import "./Home.css";
import Product from "../../components/Products/Product";
import Loader from "../../components/layout/Loader/Loader";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function getData() {
    setisLoading(true);
    const response = await fetch(
      `/api/v1/products/?page=${page - 1}&pagination=true`
    );
    const { data } = await response.json();

    // setProducts(data.products);
    setProducts([...products, ...data.products]);
    setisLoading(false);
  }

  useEffect(() => {
    getData();
  }, [page]);

  function handleObeserve(){

  }

  function changeCategory(e) {
    setCategoryFilter(e.target.innerText.toLowerCase());
  }

  function filterByPrice(e) {
    setPriceFilter(e.target.dataset.type);
  }

  function removeFilters(e) {
    setCategoryFilter("");
    setPriceFilter("");
    setNameFilter("");
  }

  function changePage(type) {
    const a = sessionStorage.getItem("page");
    if (!a) sessionStorage.setItem("page", "1");

    if (type === "prev" && page > 1) {
      sessionStorage.setItem("page", (page - 1).toString());
    } else if (type === "next") {
      sessionStorage.setItem("page", (page + 1).toString());
    }

    if (products.length === 0) {
      sessionStorage.setItem("page", "1");
    }

    const num = parseInt(sessionStorage.getItem("page"));
    setPage(num);
  }

  return (
    <Fragment>
      <div className="banner">
        <p>Welcome to Ecommerce Store</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>

        <a href="#heading">
          <button>Buy Now</button>
        </a>
      </div>

      <h2 className="heading" id="heading">
        All Products
      </h2>

      <div className="filters">
        <div className="product_search">
          <form className="search_form">
            <button className="search_button">
              <SearchIcon />
            </button>
            <input
              type="text"
              name="product"
              id="product_name"
              placeholder="Search for a product"
              autoComplete="off"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </form>
        </div>

        <div className="filter_buttons">
          <div className="dropdown">
            <button className="dropbtn">Categories</button>
            <div className="dropdown_content">
              <span onClick={changeCategory}>Consoles</span>
              <span onClick={changeCategory}>Laptops</span>
              <span onClick={changeCategory}>Storage</span>
              <span onClick={changeCategory}>Monitors</span>
              <span onClick={changeCategory}>Audio-devices</span>
              <span onClick={changeCategory}>Smart-devices</span>
              <span onClick={changeCategory}>Peripherals</span>
              <span onClick={changeCategory}>Accessories</span>
            </div>
          </div>

          <div className="dropdown">
            <button className="dropbtn">Sort by price</button>
            <div className="dropdown_content">
              <span data-type="decrease" onClick={filterByPrice}>
                Higher Price <ArrowUpwardIcon />
              </span>
              <span data-type="increase" onClick={filterByPrice}>
                Lower Price <ArrowDownwardIcon />
              </span>
            </div>
          </div>

          <button className="clear_filters" onClick={removeFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="products_container">
        {products
          .filter((p) => categoryFilter === "" || p.category === categoryFilter)
          .sort((a, b) => {
            if (priceFilter === "") return 0;

            const x = parseFloat(a.price),
              y = parseFloat(b.price);

            if (x === y) return 0;
            if (priceFilter === "decrease") {
              if (x > y) return -1;
            } else if (priceFilter === "increase") {
              if (x < y) return -1;
            }
            return 1;
          })
          .map((product, idx) => {
            if (nameFilter === "" || product.name.toLowerCase().includes(nameFilter.toLowerCase())) {
              return <Product key={idx} product={product} />;
            }
          })}

        {isLoading && (
          <div className="loading_message">
            <Loader />
            Fetching Products
          </div>
        )}
      </div>

      <div className="page_buttons">
        <button className="prev" onClick={(e) => changePage("prev")}>
          <ArrowBackIosIcon /> Prev
        </button>
        <span>{page}</span>
        <button className="next" onClick={(e) => changePage("next")}>
          Next
          <ArrowForwardIosIcon />
        </button>
      </div>
    </Fragment>
  );
}

export default Home;
