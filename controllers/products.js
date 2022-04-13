const db = require("../config/db-config");
const SqlString = require("sqlstring");
const { cloudinary } = require("../config/cloudinary-config");

// Util functions
const { newHttpError } = require("../utils/error");

const getAllProducts = async (req, res, next) => {
  const { page = 1, pagination = false, phrase = "" } = req.query;

  try {
    let queryString = `
      SELECT products.*, image_url 
      FROM products
      JOIN images
      ON products.id = product_id 
      WHERE images.id IN 
          (SELECT MIN(id) FROM images WHERE product_id = products.id)
        AND products.name LIKE '%${phrase}%'
    `

    if(pagination === 'true'){    
      queryString += `OFFSET ${page * 5} LIMIT 5`
    }

    const { rows } = await db.query(queryString);
    return res.status(200).json({ data: { products: rows } });
  } 
  catch (error) {
    return next(newHttpError(500, "Internal server error"))
  }
};

const getProduct = async (req, res, next) => {
  const { id: product_id } = req.params;

  try {
     const { rows } = await db.query(
       `SELECT products.*, images.*, reviews.*
        FROM products
        JOIN 
          (SELECT json_agg(
            json_build_object('image_id',id,'image_url',image_url,'filename',filename)
           )  AS images FROM images WHERE product_id = $1) AS images 
         ON 1=1
        JOIN (
          SELECT json_agg(
             json_build_object('review_id',reviews.id,'created_at',created_at,'rating',rating,'review',review,'user_id',users.id,'user_name',users.name)
          )  AS reviews FROM reviews JOIN users ON reviews.user_id = users.id WHERE product_id = $1) AS reviews
       ON 1=1
       WHERE products.id = $1`, 
        [product_id]
     );

     res.status(200).json({ data: rows[0] });
  } catch (error) {
    return next(newHttpError(500, "Internal server error"))
  }
};

const addProduct = async (req, res, next) => {
  const { name, description, price, stock, category, currency } = req.body;
  const productImages = req.files;

  try {
    // insert product info
    const { rows: [{ id: productId }] } =  await db.query(
      `INSERT INTO products (name, description, price, stock, category, currency)
          VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
      [name, description, price, stock, category, (currency).toUpperCase()]
    );

    const allImages = [];
    productImages.forEach((image) => {
      const eachImage = [ productId, image.path, image.filename ];
      allImages.push(eachImage);
    })

    // insert all images of the product
    const insertImagesQuery = SqlString.format(`INSERT INTO images (product_id, image_url, filename) VALUES ?`, [allImages]);
    await db.query(insertImagesQuery);

    return res.status(200).json({ data: { message: "Product added" } });
  } 
  catch (error) {
    return next(newHttpError(500, "Internal server error"))
  }
};

const editProduct = async (req, res, next) => {
  const { id: productId } = req.params;
  const { name, description, price, stock, category, currency, deleteImages } = req.body;
  const productImages = req.files;
  
  try {
    // delete all images selected, from cloud and database
    const deleteImagesId = [];
    for(const image of JSON.parse(deleteImages)){
      cloudinary.uploader.destroy(image.filename);
      deleteImagesId.push(parseInt(image.image_id));
    }

    if(deleteImagesId.length > 0){
      const deleteImagesQuery = SqlString.format(`DELETE FROM images WHERE id IN (?)`, [deleteImagesId]);
      await db.query(deleteImagesQuery);
    }

    // Update the information of the product
    await db.query(
      `UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category = $5, currency = $6 WHERE id = $7`,
      [name, description, price, stock, category, currency, productId]
    );

     // Insert all newly update images of the product
     const allImagesToUpload = [];
     productImages.forEach((image) => {
       const eachImage = [ productId, image.path, image.filename ];
       allImagesToUpload.push(eachImage);
     })

     if(allImagesToUpload.length > 0){
       const insertImagesQuery = SqlString.format(`INSERT INTO images (product_id, image_url, filename) VALUES ?`, [allImagesToUpload]);
       await db.query(insertImagesQuery);
     }

    return res.status(200).json({ data: { message: `Product successfully edited` } });
  } 
  catch (error) {
    return next(newHttpError(500, "Internal server error"))
  }
};

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    // delete images from cloud
    const { rows } = await db.query(`SELECT * FROM images WHERE product_id = $1`, [id]);
    rows.forEach((image) => {
      cloudinary.uploader.destroy(image.filename);
    })

    const x = await db.query(`DELETE FROM products WHERE id = $1`, [id]);
    return res.status(200).json({ data: { message: "Product deleted" } });
  } 
  catch (error) {
    return next(newHttpError(500, "Internal server error"))
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
};
