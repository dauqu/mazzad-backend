const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
const slugify = require("slugify");

const db = admin.firestore();
const productsCollection = db.collection("products");

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

router.post("/", (req, res) => {
  const db = admin.firestore();
  const usersCollection = db.collection("products");

  //Generate slug with filter and replace spaces with dashes
  const slug = slugify(req.body.title, {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
  });

  //Generate Random product id
  const productId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  //Generate Random number for SKU
  const sku = Math.floor(Math.random() * 1000000);

  //Insert a new document into the collection
  usersCollection.doc(productId).set({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    sku: sku,
    slug: slug,
    video: req.body.video,
    video_thumbnail: req.body.video_thumbnail,
    gallery: req.body.gallery,
    tags: req.body.tags,
    createdBy: "admin",
    productId: productId,
    createdAt: new Date().toISOString(),
  });

  //Send response
  res.status(200).send({
    message: "Product registered successfully",
  });
});

//Get a product
router.get("/:id", async (req, res) => {
  try {
    const response = await productsCollection.doc(req.params.id).get();
    const product = response.data();
    res.send(product);
  } catch (error) {
    res.send(error);
  }
});

//Update a product
router.put("/:id", async (req, res) => {
  try {
    const response = await productsCollection.doc(req.params.id).update({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      video: req.body.video,  
      video_thumbnail: req.body.video_thumbnail,
      gallery: req.body.gallery,
      tags: req.body.tags,
      updatedAt: new Date().toISOString(),
    });
    res.send("Product updated successfully");
  } catch (error) {
    res.send(error);
  }
});

//Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const response = await productsCollection.doc(req.params.id).delete();
    res.send("Product deleted successfully");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
