const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
const slugify = require("slugify");

//Create service (POST)
router.post("/", (req, res) => {
  const db = admin.firestore();
  const servicesCollection = db.collection("services");

  //Add new service to the collection
  servicesCollection.add({
    name: req.body.name,
    slug: slugify(req.body.name, {
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
      lower: true,
    }),
    description: req.body.description,
    video: req.body.video,
    video_thumbnail: req.body.video_thumbnail,
    gallery: req.body.gallery,
    tags: req.body.tags,
    createdBy: "harsha",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  //Send response
  res.status(200).send({
    message: "Service added successfully",
  });
});

//Read all services (GET)
router.get("/", async (req, res) => {
  const db = admin.firestore();
  const servicesCollection = db.collection("services");
  const services = await servicesCollection.get();
  const servicesArray = [];
  services.forEach((doc) => {
    servicesArray.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  res.status(200).send(servicesArray);
});

//Read a service (GET)
router.get("/:id", async (req, res) => {
  const db = admin.firestore();
  const servicesCollection = db.collection("services");
  const service = await servicesCollection.doc(req.params.id).get();
  if (!service.exists) {
    res.status(404).send({
      message: "Service not found",
    });
  } else {
    res.status(200).send({
      id: service.id,
      ...service.data(),
    });
  }
});

//Update a service (PUT)
router.put("/:id", async (req, res) => {
  const db = admin.firestore();
  const servicesCollection = db.collection("services");
  const service = await servicesCollection.doc(req.params.id).get();
  if (!service.exists) {
    res.status(404).send({
      message: "Service not found",
    });
  } else {
    await servicesCollection.doc(req.params.id).update({
      name: req.body.name,
      slug: slugify(req.body.name, {
        replacement: "-",
        remove: /[*+~.()'"!:@]/g,
        lower: true,
      }),
      description: req.body.description,
      video: req.body.video,
      video_thumbnail: req.body.video_thumbnail,
      gallery: req.body.gallery,
      tags: req.body.tags,
      updatedAt: new Date().toISOString(),
    });
    res.status(200).send({
      message: "Service updated successfully",
    });
  }
});

//Delete a service (DELETE)
router.delete("/:id", async (req, res) => {
  const db = admin.firestore();
  const servicesCollection = db.collection("services");
  const service = await servicesCollection.doc(req.params.id).get();
  if (!service.exists) {
    res.status(404).send({
      message: "Service not found",
    });
  } else {
    await servicesCollection.doc(req.params.id).delete();
    res.status(200).send({
      message: "Service deleted successfully",
    });
  }
});

module.exports = router;
