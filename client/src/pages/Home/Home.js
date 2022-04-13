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
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allProductsTemp, setAllProductsTemp] = useState([]);

  async function getProducts() {
    setisLoading(true);
    const response = await fetch(
      `/api/v1/products/?page=${page - 1}&pagination=true`
    );
    const { data } = await response.json();

    if (data.products && data.products.length === 0) {
      console.log("No more products");
      setHasMore(false);
    }

    setAllProducts([...allProducts, ...data.products]);
    setisLoading(false);
  }

  async function getSearchedProducts(e) {
    if (!nameFilter) return;

    setisLoading(true);

    const response = await fetch(`/api/v1/products/?phrase=${nameFilter}`);
    const { data, error } = await response.json();

    setisLoading(false);

    if (!error) {
      // copy all products to a variable
      setAllProductsTemp(allProducts);
      setAllProducts(data.products);
    }
  }

  function changeCategory(e) {
    setCategoryFilter(e.target.innerText.toLowerCase());
  }

  function filterByPrice(e) {
    setPriceFilter(e.target.dataset.type);
  }

  function removeFilters(e) {
    setAllProducts(allProductsTemp);
    setAllProductsTemp([]);

    setCategoryFilter("");
    setPriceFilter("");
    setNameFilter("");
  }

  useEffect(async () => {
    await getProducts();

    const lastProductObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || !hasMore) return;

        setPage((prevPage) => {
          return prevPage + 1;
        });

        lastProductObserver.unobserve(entries[0].target);
      },
      { threshold: 0.4 }
    );

    const allProductsEle = document.querySelectorAll(".product");
    lastProductObserver.observe(allProductsEle[allProductsEle.length - 1]);
  }, [page]);

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
          <div className="search_form">
            <button className="search_button" onClick={getSearchedProducts}>
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
          </div>
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
        {allProducts
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
          .map((product, idx) => (
            <Product key={idx} product={product} />
          ))}

        {!hasMore && (
          <div className="note">
            You have browsed all products.
          </div>
        )}

        {isLoading && (
          <div className="loading_message">
            <Loader />
            Fetching Products
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default Home;
