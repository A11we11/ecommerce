const paypal = require("@paypal/paypal-server-sdk");

// Configuration for the newer PayPal SDK
const { Client, Environment } = paypal;

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  environment:
    process.env.NODE_ENV === "production"
      ? Environment.Production
      : Environment.Sandbox,
});

module.exports = {
  paypal: client,
  ...paypal, // This spreads all PayPal SDK exports
};

// Alternative configuration if using the older pattern:
/*
const paypal = require("@paypal/paypal-server-sdk");

paypal.configure({
  mode: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

module.exports = paypal;
*/
