const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
const slugify = require("slugify");

const VerifyToken = require("../functions/verify-token");

const db = admin.firestore();
const productsCollection = db.collection("products");

//Get all Products only for admin
router.get("/", async (req, res) => {
  const db = admin.firestore();
  const addressCollection = db.collection("products");
  const address = await addressCollection.get();
  const addressArray = [];
  address.forEach((doc) => {
    addressArray.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  res.status(200).send(addressArray);
});

//Get my product
router.get("/my-products", async (req, res) => {
  //Get token from header
  const token =
    req.body.token || req.cookies.token || req.headers["x-access-token"];

  //Return if no token
  if (!token) {
    res.status(401).send({
      message: "No token provided",
    });
  }

  //Check if no token
  const verified = VerifyToken(token);

  const username = verified.username;

  productsCollection
    .where("createdBy", "==", username)
    .get()
    .then((snapshot) => {
      const products = [];
      snapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      res.status(200).send(products);
    });
});
// code to get my product by id
// router.get("/my-products/:id", async (req, res) => {
//   try {
//     const response = await usersCollection.doc(req.params.id).get();
//     const product = response.data();
//     res.json({
//       message: "Product fetched successfully",
//       product,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: error.message,
//     });
//   }
// });

// code to update product offer price
router.put("/my-products/:id", async (req, res) => {
  try {
    const token =
      req.body.token || req.cookies.token || req.headers["x-access-token"];
    const db = admin.firestore();
    const usersCollection = db.collection("products");
    const verify = VerifyToken(token);
    if (!verify) {
      return res.status(401).send({
        message: "Invalid token",
      });
    }

    const username = verify.username;

    const response = await usersCollection.doc(req.params.id).update({
      offerPrice: req.body.offerPrice,
      currency: req.body.currency,
      updatedBy: username,
      updatedAt: new Date().toISOString(),
    });
    res.json({
      message: "Offer price updated successfully",
      response,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

// router.post("/", (req, res) => {
//   try {

//     const token = req.body.token || req.cookies.token || req.headers["x-access-token"];
//     const db = admin.firestore();
//     const usersCollection = db.collection("products");

//     //Generate slug with filter and replace spaces with dashes
//     const slug = slugify(req.body.name, {
//       replacement: "-",
//       remove: /[*+~.()'"!:@]/g,
//       lower: true,
//     });

//     //Generate Random product id
//     const productId =
//       Math.random().toString(36).substring(2, 15) +
//       Math.random().toString(36).substring(2, 15);

//     //Generate Random number for SKU
//     const sku = Math.floor(Math.random() * 1000000);

//     const verify = VerifyToken(token);
//     if (!verify) {
//       return res.status(401).send({
//         message: "Invalid token",
//       });
//     }

//     const username = verify.username;

//     //Insert a new document into the collection
//     usersCollection.doc(productId).set({
//       name: req.body.name,
//       description: req.body.description,
//       category: req.body.category,
//       sku: sku,
//       slug: slug,
//       video: req.body.video,
//       video_thumbnail: req.body.video_thumbnail,
//       gallery: req.body.gallery,
//       tags: req.body.tags,
//       createdBy: username,
//       productId: productId,
//       createdAt: new Date().toISOString(),
//     });

//     //Send response
//     res.status(200).send({
//       message: "Product registered successfully",
//     });
//   } catch (error) {

//     return res.status(500).send({
//       message: error.message
//     });
//   }
// });

// //Get a product
router.get("/:id", async (req, res) => {
  try {
    const response = await productsCollection.doc(req.params.id).get();
    const product = response.data();
    res.send(product);
  } catch (error) {
    res.send(error);
  }
});

// //Update a product
// router.put("/:id", async (req, res) => {
//   try {
//     const response = await productsCollection.doc(req.params.id).update({
//       name: req.body.name,
//       description: req.body.description,
//       category: req.body.category,
//       video: req.body.video,
//       video_thumbnail: req.body.video_thumbnail,
//       gallery: req.body.gallery,
//       tags: req.body.tags,
//       updatedAt: new Date().toISOString(),
//     });
//     res.send("Product updated successfully");
//   } catch (error) {
//     res.send(error);
//   }
// });

// //Delete a product
// router.delete("/:id", async (req, res) => {
//   try {
//     const response = await productsCollection.doc(req.params.id).delete();
//     res.send("Product deleted successfully");
//   } catch (error) {
//     res.send(error);
//   }
// });

module.exports = router;
