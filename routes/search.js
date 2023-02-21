const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

//Search products
router.get("/products", async (req, res) => {
  const db = admin.firestore();
  const productsCollection = db.collection("products");
  const products = await productsCollection.get();
  const productsArray = [];
  products.forEach((doc) => {
    productsArray.push({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      sku: doc.data().sku,
      slug: doc.data().slug,
      video: doc.data().video,
      video_thumbnail: doc.data().video_thumbnail,
      gallery: doc.data().gallery,
      tags: doc.data().tags,
      createdBy: doc.data().createdBy,
      productId: doc.data().productId,
      category: doc.data().category,
      createdAt: doc.data().createdAt,
    });
  });
  res.status(200).send(productsArray);
});

// code to search products by category
router.get("/products/:category", async (req, res) => {
  const db = admin.firestore();
  const productsCollection = db.collection("products");
  const products = await productsCollection.get();
  const productsArray = [];
  products.forEach((doc) => {
    if (doc.data().category === req.params.category) {
      productsArray.push({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        price: doc.data().price,
        category: doc.data().category,
        createdAt: doc.data().createdAt,
      });
    }
  });
  res.status(200).send(productsArray);
});

// code to search products by created by
router.get("/products/createdBy/:createdBy", async (req, res) => {
  const db = admin.firestore();
  const productsCollection = db.collection("products");
  const products = await productsCollection.get();
  const productsArray = [];
  products.forEach((doc) => {
    if (doc.data().createdBy === req.params.createdBy) {
      productsArray.push({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        category: doc.data().category,
        sku: doc.data().sku,

        slug: doc.data().slug,
        video: doc.data().video,
        video_thumbnail: doc.data().video_thumbnail,
        gallery: doc.data().gallery,
        tags: doc.data().tags,
        createdBy: doc.data().createdBy,
        productId: doc.data().productId,
        createdAt: doc.data().createdAt,
      });
    }
  });
  res.status(200).send(productsArray);
});

// code to search products by slug
router.get("/products/slug/:slug", async (req, res) => {
  const db = admin.firestore();
  const productsCollection = db.collection("products");

  const products = await productsCollection.get();
  const productsArray = [];
  products.forEach((doc) => {
    if (doc.data().slug === req.params.slug) {
      productsArray.push({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        category: doc.data().category,
        sku: doc.data().sku,
        slug: doc.data().slug,

        video: doc.data().video,
        video_thumbnail: doc.data().video_thumbnail,
        gallery: doc.data().gallery,
        tags: doc.data().tags,
        createdBy: doc.data().createdBy,
        productId: doc.data().productId,
        createdAt: doc.data().createdAt,
      });
    }
  });

  res.status(200).send(productsArray);
});

module.exports = router;
