const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");

//Get all companies from the collection companies
router.get("/", async (req, res) => {
  const db = admin.firestore();
  const companiesCollection = db.collection("companies");
  const resp = await companiesCollection.get();
  const companies = resp.docs.map((doc) => ({
    id: doc.id,
    data: doc.data(),
  }));
  res.status(200).send(companies);
});

//Create a company
router.post("/", async (req, res) => {
  const db = admin.firestore();
  const companiesCollection = db.collection("companies");

  const company = await companiesCollection.add({
    name: req.body.name,
    description: req.body.description,
    address: req.body.address, //Address id
    gst: req.body.gst,
    company_owner: req.body.company_owner, //User id
    category: req.body.category,
    tags: req.body.tags, //Array of tags
    featured_image: req.body.featured_image,
    digital_signature: req.body.digital_signature,
    status: "pending",
    isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  res.status(201).send({
    id: company.id,
  });
});

//Get a company by id
router.get("/:id", async (req, res) => {
  const db = admin.firestore();
  const companiesCollection = db.collection("companies");
  const company = await companiesCollection.doc(req.params.id).get();
  if (!company.exists) {
    res.status(404).send("Company not found");
  } else {
    res.status(200).send(company.data());
  }
});

//Update a company
router.put("/:id", async (req, res) => {
  try {
    const db = admin.firestore();
    const companiesCollection = db.collection("companies");
    const company = await companiesCollection.doc(req.params.id).get();
    if (!company.exists) {
      res.status(404).send("Company not found");
    } else {
      await companiesCollection.doc(req.params.id).update({
        ...req.body,
      });
      res.status(203).json({
        message: "Company updated successfully",
        status: "success",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
});

//Delete a company
router.delete("/:id", async (req, res) => {
  try {
    const db = admin.firestore();
    const companiesCollection = db.collection("companies");
    const company = await companiesCollection.doc(req.params.id).get();
    if (!company.exists) {
      return res.status(404).json({ message: "Company not found" });
    } else {
      await companiesCollection.doc(req.params.id).delete();
      res.status(204).json({ message: "Company deleted successfully." });
    }
  } catch (error) {
    return res.status(504).json({ message: error.message });
  }
});

module.exports = router;
