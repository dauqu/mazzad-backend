const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const fs = require("fs");
require("dotenv").config();
//Import cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Allow cors
const cors = require("cors");
//Loop of allowed origins
const allowedOrigins = [
  "https://mazzad-admin-k1le.vercel.app",
  "http://localhost:3000",
  "https://companyadminpanel.vercel.app",
  "https://mazzad-admin-y5al4g.dauqu.host",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const fileUpload = require("express-fileupload");
// Enable file upload using express-fileupload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//Config Firebase
const { fire_auth } = require("./config/firebase");
var admin = require("firebase-admin");
// const SendMail = require("./functions/smtp");

admin.initializeApp({
  credential: admin.credential.cert(fire_auth),
});

app.use(express.json());

// app.use(express.static(__dirname + "/"));

//Allow public access to storage
app.use(express.static("./storage"));

app.get("/files", async (req, res) => {
  //Read dir and return JSON
  fs.readdir(__dirname + "/storage", (err, files) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({
        files: files,
        files: files.map((file) => {
          return {
            name: file,
            url: `${req.protocol}://${req.get("host")}/${file}`,
          };
        }),
      });
    }
  });
});

//Get all files
app.get("/", async (req, res) => {
  // SendMail().catch(console.error);

  res.send("Hello World");
});

app.use("/api/v1/register", require("./routes/register"));
app.use("/api/v1/login", require("./routes/login"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/products", require("./routes/products"));
app.use("/api/v1/auctions", require("./routes/auctions"));
app.use("/api/v1/bids", require("./routes/bids"));
app.use("/api/v1/address", require("./routes/address"));
app.use("/api/v1/account", require("./routes/bank-accounts"));
app.use("/api/v1/opportunities", require("./routes/opportunities"));
app.use("/api/v1/emails", require("./routes/emails"));
app.use("/api/v1/storage", require("./routes/storage"));
app.use("/api/v1/categories", require("./routes/categories"));
app.use("/api/v1/tags", require("./routes/tags"));
app.use("/api/v1/invoice", require("./routes/invoice"));
app.use("/api/v1/cart", require("./routes/cart"));
app.use("/api/v1/support", require("./routes/support"));
app.use("/api/v1/search", require("./routes/search"));
app.use("/api/v1/profile", require("./routes/profile"));
app.use("/api/v1/companies", require("./routes/companies"));
app.use("/api/v1/refund", require("./routes/refund"));
app.use("/api/v1/complaints", require("./routes/complaints"));
app.use("/api/v1/contract", require("./routes/contract"));
app.use("/api/v1/ads", require("./routes/ads-management"));
app.use("/api/v1/rate", require("./routes/rate"));
app.use("/api/v1/logs", require("./routes/logs"));
app.use("/api/v1/notification", require("./routes/notifications"));
app.use("/api/v1/transactions", require("./routes/transactions"));
app.use("/api/v1/sms", require("./routes/sms"));
app.use("/api/v1/favorites", require("./routes/favorites"));
app.use("/api/v1/wallet", require("./routes/wallets"));
app.use("/api/v1/offers", require("./routes/offers"));
app.use("/api/v1/jobs", require("./routes/jobs_post"));

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
