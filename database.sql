-- users 
CREATE TABLE users(
   id BIGSERIAL PRIMARY KEY,
   name VARCHAR(30) NOT NULL,
   email VARCHAR(50) NOT NULL,
   password TEXT NOT NULL
);

-- users sessions
CREATE TABLE user_sessions (
   sid VARCHAR NOT NULL COLLATE "default",
	sess JSON NOT NULL,
	expire timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE user_sessions ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "user_sessions" ("expire");


-- products 
CREATE TABLE products(
   id BIGSERIAL PRIMARY KEY,
   name VARCHAR(70) NOT NULL,
   description TEXT NOT NULL,
   price NUMERIC(8, 2) NOT NULL,
   stock INTEGER NOT NULL,
   category VARCHAR(20) NOT NULL,
   currency VARCHAR(3) NOT NULL
);

-- images 
CREATE TABLE images(
   id BIGSERIAL PRIMARY KEY,
   image_url TEXT NOT NULL,
   filename TEXT NOT NULL,
   product_id BIGINT REFERENCES products(id) ON DELETE CASCADE
);

-- reviews 
CREATE TABLE reviews(
   id BIGSERIAL PRIMARY KEY,
   product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
   user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
   rating SMALLINT DEFAULT 1,
   review TEXT NOT NULL,
   created_at DATE DEFAULT CURRENT_TIMESTAMP
);

-- orders
CREATE TABLE orders(
   id BIGSERIAL PRIMARY KEY,
   user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
   created_at DATE DEFAULT CURRENT_TIMESTAMP,
   price NUMERIC(20, 4) NOT NULL,
   currency VARCHAR(3) NOT NULL,
   payment_status VARCHAR(10),
   shipping_date DATE,
   delivery_status VARCHAR(20)
);

-- order items
CREATE TABLE order_items(
   id BIGSERIAL PRIMARY KEY,
   order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
   product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
   quantity INTEGER NOT NULL,
   subtotal NUMERIC(20, 4) NOT NULL,
   currency VARCHAR(3) NOT NULL
);

-- shipping address 
CREATE TABLE shipping_address(
   id BIGSERIAL PRIMARY KEY,
   order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
   address VARCHAR(100) NOT NULL,
   city VARCHAR(30) NOT NULL,
   state VARCHAR(30) NOT NULL,
   country VARCHAR(30) NOT NULL,
   postal_code VARCHAR(6) NOT NULL,
   phone VARCHAR(10) NOT NULL
);

-- roles 
CREATE TABLE roles(
   id BIGSERIAL PRIMARY KEY,
   name VARCHAR(20) NOT NULL
);

-- user roles
CREATE TABLE user_roles(
   user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
   roles_id BIGINT REFERENCES roles(id) ON DELETE CASCADE
);
