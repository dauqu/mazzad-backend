const express = require("express");
const router = express.Router();
//Firebase admin
const admin = require("firebase-admin");

//Get all notifications
router.get("/", async (req, res) => {
    const db = admin.firestore();
    const notificationsCollection = db.collection("notifications");

    try {
        const response = await notificationsCollection.get();
        const notifications = response.docs.map((doc) => doc.data());
        res.send(notifications);
    }
    catch (error) {
        res.send(error);
    }

});

//Get a notification
router.get("/:id", async (req, res) => {
    const db = admin.firestore();
    const notificationsCollection = db.collection("notifications");
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
    const db = admin.firestore();
    const notificationsCollection = db.collection("notifications");

    //Add new notification to the collection
    notificationsCollection.add({
        title: req.body.title,
        description: req.body.description,
        createdAt: new Date().toISOString(),
    });

    //Send response
    res.status(200).send({
        message: "Notification added successfully",

    });
});

//Update a notification
router.put("/:id", async (req, res) => {
    const db = admin.firestore();
    const notificationsCollection = db.collection("notifications");
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

