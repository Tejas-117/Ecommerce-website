import { useState } from "react";
import "./DashboardProducts.css";
import Loader from "../layout/Loader/Loader";
import CloseIcon from "@mui/icons-material/Close";

function DashboardProducts({ allProducts, setMessage, resetMessage }) {
  const [products, setProducts] = useState(allProducts);

  // delete a product
  async function deleteProduct(e, product_id) {
    const response = await fetch(`/api/v1/products/${product_id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const { data, error } = await response.json();

    if (error) {
      setMessage("Couldn't delete product");
      resetMessage();
    } 
    else {
      const deletedProductIdx = products.findIndex(product => product.id === product_id);
      products.splice(deletedProductIdx, 1);
      setProducts([...products]);

      setMessage(data.message);
      resetMessage();
    }
  }

  return (
    <div className="dashboard_product_container">
      <a href="/admin/dashboard/add-product">
        <button className="add_product">Add Product</button>
      </a>

      <div>
        {products.map((product) => (
          <div className="dashboard_product" key={product.id}>
            <div className="product_image_container">
              <img src={product.image_url} alt="product image" />
            </div>

            <div className="dashboard_product_details">
              <h3>{product.name}</h3>
              <p>{product.description.substring(0, 100) + "..."}</p>
              <p>
                Price:{" "}
                {product.price +
                  " " +
                  (product.currency ? product.currency : "")}
              </p>
              <p>Stock: {product.stock}</p>

              <div className="product_buttons">
                <a href={`/admin/dashboard/edit-product/${product.id}`}>
                  <button className="edit_product">Edit</button>
                </a>
                <button
                  className="delete_product"
                  onClick={(e) => deleteProduct(e, product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardProducts;
