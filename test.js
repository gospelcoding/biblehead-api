const Axios = require("axios");
const secrets = require("./secrets");

Axios.post("http://localhost:3000/api/verses/", {
  verses: [
    { ref: "Genesis 1:1", text: "In the beginning" },
    { ref: "John 3:16", text: "God so loved" },
    { ref: "Heb 4.12", text: "The word of God" }
  ],
  formatVersion: 1,
  apiKey: secrets.apiKey
})
  .then(response => console.log(response))
  .catch(response => console.log(response));

// Axios.get("http://localhost:3000/api/verses/ABHB")
//   .then(res => console.log(res.data))
//   .catch(res => console.error(res));
