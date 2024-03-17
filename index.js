const pricing = {
  skippi: 20,
  toasteta3: 80,
  toasteta5: 120,
  coffee: 60,
  combo1: 180,
  combo2: 160,
};

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://0.0.0.0:27017/zaykaStall");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const formDataSchema = new mongoose.Schema({
  name: String,
  pNumber: Number,
  skippi: Number,
  tosteta: Number,
  tostetaCount: Number,
  coffee: Number,
  combo1: Number,
  combo2: Number,
  paymentMode: String,
});

const FormData = mongoose.model("FormData", formDataSchema);

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit-form", async (req, res) => {
  res.redirect("/");
  const formData = new FormData({
    name: req.body.name,
    pNumber: "+91" + req.body.pNumber,
    skippi: req.body.skippiCount || 0,
    tosteta: req.body.tosteta,
    tostetaCount: req.body.tostetaCount || 0,
    coffee: req.body.coffeeCount || 0,
    combo1: req.body.combo1Count || 0,
    combo2: req.body.combo2Count || 0,
    paymentMode: req.body["payment-mode"],
  });
  const receipientName = req.body.name;
  const receipientNumber = "91" + req.body.pNumber;
  const skippi = parseInt(req.body.skippiCount) || 0;
  const toasteta = "toasteta" + (req.body.tosteta || 3);
  const toastetaCount = parseInt(req.body.tostetaCount) || 0;
  const coffee = parseInt(req.body.coffeeCount) || 0;
  const combo1 = parseInt(req.body.combo1Count) || 0;
  const combo2 = parseInt(req.body.combo2Count) || 0;
  const paymentMode = req.body["payment-mode"];

  const total =
    skippi * pricing["skippi"] +
    toastetaCount * pricing[toasteta] +
    coffee * pricing["coffee"] +
    combo1 * pricing["combo1"] +
    combo2 * pricing["combo2"];

  finalTotal = total;

  const message = `Hello ${receipientName}, Thank you for ordering at Tangy Tales. You paid a total of ${total}₹ in ${paymentMode} mode. Do visit us again!! 😊`;

  axios.post(
    "http://localhost:3000/messages/send?sessionId=Prasann",
    {
      jid: `${receipientNumber}@s.whatsapp.net`,
      type: "number",
      message: {
        text: message,
      },
    },
    {
      headers: {
        auth_token: "hello1234",
      },
    }
  );
  formData.save();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
