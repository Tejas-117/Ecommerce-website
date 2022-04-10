import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditProduct.css";
import Loader from "../layout/Loader/Loader";
import CloseIcon from "@mui/icons-material/Close";

function EditProduct() {
  const { id: productId } = useParams();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [currency, setCurrency] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("currency", currency);

    // A product can have atmost 4 images.
    // (current_images - deleted_images) + (newly_upload_images) = 4;
    // newly_upload_images = 4 - (current_images - delete_images)

    const allImageToDelete = document.querySelectorAll("[name=deleteImages]");
    let numOfImagesToDelete = 0; 
    let deleteImagesList = [];
    for (const image of allImageToDelete) {
      if (image.checked) {
        numOfImagesToDelete += 1;
        deleteImagesList.push({ image_id: image.dataset.id, filename: image.value });
      }
    }
    formData.append("deleteImages", JSON.stringify(deleteImagesList));

    const possibleNumOfUploadImages = 4 - (currentImages.length - numOfImagesToDelete);
    for (let i = 0; i < possibleNumOfUploadImages && i < productImages.length; i++) {
      formData.append("productImage", productImages[i]);
    }

    const response = await fetch(`/api/v1/products/${productId}/`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
    const { data, error } = await response.json();
    
    setIsLoading(false);

    if(error){
      setMessage(error.message);
    }
    else{
      navigate("/admin/dashboard", { state: { content: 'products', message: data.message }})
    }
  }

  useEffect(() => {
    fetch(`/api/v1/products/${productId}`)
      .then((res) => res.json())
      .then(({ data }) => {
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setStock(data.stock);
        setCategory(data.category);
        setCurrency(data.currency);
        setCurrentImages(data.images);
      })
      .catch((err) => {
        // fetch again on error
        setMessage("Error while fetching product data");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
  }, []);

  return (
    <div className="edit_product_form_container">
      <form className="edit_product_form" onSubmit={handleSubmit}>
        <h1>Edit Product</h1>

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

        <label htmlFor="stock">Stock</label>
        <input
          type="number"
          min={0}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Enter product stock"
          required
        />

        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Choose a category</option>
          <option value="consoles">Consoles</option>
          <option value="laptops">Laptops</option>
          <option value="storage">Storage</option>
          <option value="monitors">Monitors</option>
          <option value="audio-devices">Audio devices</option>
          <option value="smart-devices">Smart devices</option>
          <option value="accessories">Accessories</option>
          <option value="peripherals">Peripherals</option>
        </select>

        <label htmlFor="images">Add images</label>
        <input
          type="file"
          id="image_uploads"
          name="product_images"
          multiple
          onChange={(e) => setProductImages(e.target.files)}
          placeholder="Upload images"
        />

        <label htmlFor="remove_images">Select images to remove</label>
        <div className="current_product_images">
          {currentImages.map((image) => (
            <div key={image.image_id}>
              <img src={image.image_url} alt="product image" />
              <div>
                <input
                  type="checkbox"
                  name="deleteImages"
                  value={image.filename}
                  data-id={image.image_id}
                />
                <label htmlFor={image.image_id}> Delete this image?</label>
              </div>
            </div>
          ))}
        </div>

        <div className="note">
          A product can atmost have four images, extra images will be ignored.
          Accepted image formats are '.jpg', '.jpeg', '.png'.
        </div>

        <button>Edit Product</button>
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

export default EditProduct;
