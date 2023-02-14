const express = require("express");
const router = express.Router();
//Firebase admin
const admin = require("firebase-admin");
const db = admin.firestore();
const notificationsCollection = db.collection("notifications");

//Get all notifications
router.get("/", async (req, res) => {

  try {
    const response = await notificationsCollection.get();
    let notifications = [];
    response.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json(notifications);
  } catch (error) {
    res.send(error);
  }
});

//Get a notification
router.get("/:id", async (req, res) => {
  const notification = await notificationsCollection.doc(req.params.id).get();
  if (!notification.exists) {
    res.status(404).send({
      message: "Notification not found",
    });
  } else {
    res.status(200).send({
      id: notification.id,
      title: notification.data().title,
      description: notification.data().description,
      createdAt: notification.data().createdAt,
    });
  }
});

//Create a notification
router.post("/", (req, res) => {
  const { title, description, type } = req.body;
  if (!title || !description || !type) {
    res.status(400).send({
      message: "Title, description and type are required",
    });
  }
  //Add new notification to the collection
  notificationsCollection.add({
    title: title,
    description: description,
    type: type,
    createdAt: new Date().toISOString(),
  });

  //Send response
  res.status(200).send({
    message: "Notification added successfully",
  });
});

//Update a notification
router.put("/:id", async (req, res) => {
  const notification = await notificationsCollection.doc(req.params.id).get();
  if (!notification.exists) {
    res.status(404).send({
      message: "Notification not found",
    });
  } else {
    await notificationsCollection.doc(req.params.id).update({
      title: req.body.title,
      description: req.body.description,
    });
    res.status(200).send({
      message: "Notification updated successfully",
    });
  }
});

// delete notification 
router.delete("/:id", async (req, res) => {
  const notification = await notificationsCollection.doc(req.params.id).get();
  if (!notification.exists) {
    res.status(404).send({
      message: "Notification not found",
    });
  } else {

    await notificationsCollection.doc(req.params.id).delete();
    res.status(200).send({
      message: "Notification deleted successfully",
    });
  }
});


module.exports = router;
