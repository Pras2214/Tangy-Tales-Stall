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
const { sendMessage, getQrCode, getClientStatus } = require("./server");
const QRCode = require('qrcode');

const app = express();

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

mongoose.connect((process.env.MONGODB_URI || "mongodb://0.0.0.0:27017") + "/zaykaStall");
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
  total: Number
});

const FormData = mongoose.model("FormData", formDataSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/connect", async (req, res) => {
  if (getClientStatus()) {
    res.send("<h1>WhatsApp Client is already connected!</h1>");
  } else {
    const qrCode = getQrCode();
    if (qrCode) {
      try {
        const qrImage = await QRCode.toDataURL(qrCode);
        res.send(`
          <h1>Scan this QR Code to Connect</h1>
          <img src="${qrImage}" alt="QR Code" />
          <p>Reload this page if the QR code expires.</p>
        `);
      } catch (err) {
        res.status(500).send("Error generating QR code image");
      }
    } else {
      res.send("<h1>Initializing... Please reload in a few seconds.</h1>");
    }
  }
});

app.post("/submit-form", async (req, res) => {
  res.redirect("/");
  const receipientNumber = "91" + req.body.pNumber;
  const skippi = parseInt(req.body.skippiCount) || 0;
  const toasteta = "toasteta" + (req.body.tosteta || 3);
  const toastetaCount = parseInt(req.body.tostetaCount) || 0;
  const receipientName = req.body.name;
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
    total: total
  });


  const message = `Hello ${receipientName}, Thank you for ordering at Tangy Tales. You paid a total of ${total}₹ in ${paymentMode} mode. Do visit us again!! 😊`;

  sendMessage(receipientNumber, message);
  formData.save();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
