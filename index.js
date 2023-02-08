const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
const fs = require("fs");

//Import cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Allow cors
const cors = require("cors");
//Loop of allowed origins
const allowedOrigins = ["https://mazzad-admin-k1le.vercel.app", "http://localhost:3000", "https://admin-for-all.vercel.app", "https://companyadminpanel.vercel.app"];

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

admin.initializeApp({
  credential: admin.credential.cert(fire_auth),
});

app.use(express.static(__dirname+"/"));

app.get("/", (req, res) => {
  //Read dir and return JSON
  fs.readdir("./storage", (err, files) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({
        files: files,
        files: files.map((file) => {
          return {
            name: file,
            url: `https://saudi.dauqu.host/storage/${file}`,
          };
        }),
      });
    }
  });
});

app.use("/api/v1/register", require("./routes/register"));
app.use("/api/v1/login", require("./routes/login"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/products", require("./routes/products"));
app.use("/api/v1/bids", require("./routes/bids"));
app.use("/api/v1/storage", require("./routes/storage"));
app.use("/api/v1/categories", require("./routes/categories"));
app.use("/api/v1/tags", require("./routes/tags"));
app.use("/api/v1/invoice", require("./routes/invoice"));
app.use("/api/v1/cart", require("./routes/cart"));
app.use("/api/v1/support", require("./routes/support"));
app.use("/api/v1/search", require("./routes/search"));
app.use("/api/v1/companies", require("./routes/companies"));

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
