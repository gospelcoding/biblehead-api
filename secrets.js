module.exports =
  process.env.NODE_ENV == "production"
    ? {
        dbPassword: process.env.BHA_DB_PASSWORD,
        apiKey: process.env.BHA_KEY
      }
    : require("./devSecrets.js");
