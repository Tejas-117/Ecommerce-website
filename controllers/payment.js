const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { newHttpError } = require("../utils/error");
const { calculateAmount } = require("../utils/otherUtils");
const db = require("../config/db-config");

const getPublishableKey = (req, res, next)=> {
   res.status(200).json({ key: process.env.STRIPE_PUBLISHABLE_KEY })
}

const createPaymentIntent = async (req, res, next) => {
   const { items, currency, shipping, order_id } = req.body;
   const { user } = req.session;

   const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateAmount(items),
      currency: currency,
      automatic_payment_methods: {
         enabled: true,
      },
      shipping: shipping,
      description: 'Ecommerce website',
      recepient_email: user.email,
      metadata: { order_id }
   });

   res.send({ clientSecret: paymentIntent.client_secret });
 }

module.exports = {
   getPublishableKey,
   createPaymentIntent
}