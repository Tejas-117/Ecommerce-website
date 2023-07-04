if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// UTILS
const db = require("./config/db-config");
const { newHttpError } = require("./utils/error");

// ROUTES
const productsRoute = require("./routes/products");
const reviewsRoute = require("./routes/reviews");
const usersRoute = require("./routes/users");
const ordersRoute = require("./routes/orders");
const paymentRoute = require("./routes/payment");

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("trust proxy", 1);

const sessionConfig = {
  store: new pgSession({
    conString: process.env.DATABASE_URL,
    pool: db.pool,
    tableName: "user_sessions"
  }),
  name: "Session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: (process.env.NODE_ENV === "production"),
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
  },
};

app.use(session(sessionConfig));

app.use("/api/v1/products", productsRoute);
app.use("/api/v1/products/:id/reviews", reviewsRoute);
app.use("/api/v1/users/", usersRoute);
app.use("/api/v1/orders", ordersRoute);
app.use("/api/v1/payment", paymentRoute);

// Serve static content
app.use(express.static("public"));

app.get("*", (req, res, next) => {
  res.sendFile("public/index.html");
});

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
})