import React, { useState } from "react";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import CloseIcon from "@mui/icons-material/Close";

function AddProduct() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [currency, setCurrency] = useState("");
  const [productImages, setProductImages] = useState([]);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("currency", currency);

    for (const image of productImages) {
      formData.append("productImage", image);
    }

    const response = await fetch(`/api/v1/products/`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const { data, error } = await response.json();

    if (error) {
      setMessage(error.message);
    } 
    else {
      navigate("/admin/dashboard", {
        state: { content: "products", message: data.message },
      });
    }
  }

  return (
    <div className="add_product_form_container">
      <form className="add_product_form" onSubmit={handleSubmit}>
        <h1>Add Product</h1>

        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          placeholder="Enter your description"
          maxLength={200}
          cols="30"
          rows="10"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <label htmlFor="price">Price</label>
        <input
          type="number"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter Price"
          required
        />

        <label htmlFor="stock">Stock</label>
        <input
          type="number"
          min={0}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Enter product stock"
          required
        />

        <label htmlFor="category">Choose a category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="consoles">Consoles</option>
          <option value="laptops">Laptops</option>
          <option value="storage">Storage</option>
          <option value="monitors">Monitors</option>
          <option value="audio-devices">Audio devices</option>
          <option value="smart-devices">Smart devices</option>
          <option value="accessories">Accessories</option>
          <option value="peripherals">Peripherals</option>
        </select>

        <label htmlFor="currency">Currency</label>
        <input
          type="text"
          name="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder="Enter currency format, (INR, USD, ...)"
          maxLength={3}
          required
        />

        <label htmlFor="images">Upload images</label>
        <input
          type="file"
          id="image_uploads"
          name="product_images"
          multiple
          onChange={(e) => setProductImages(e.target.files)}
          placeholder="Upload images"
          required
        />

        <div className="note">
          A product can atmost have four images, extra images will be ignored.
          Accepted image formats are '.jpg', '.jpeg', '.png'.
        </div>

        <button>Create Product</button>
      </form>

      <div className="message_container">
        {isLoading && <Loader />}

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

export default AddProduct;
