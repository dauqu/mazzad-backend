const router = require("express").Router();
const admin = require("firebase-admin");

router.post("/", async (req, res) => {
  try {
    const db = admin.firestore();
    const complaintsCollection = db.collection("complaints");
    const complaint = await complaintsCollection.add({
      title: req.body.title,
      description: req.body.description,
      status: "pending",
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    });
    res.status(201).json({
      message: "Complaint created successfully",
      complaint: {
        id: complaint.id,
        ...(await complaint.get()).data(),
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const db = admin.firestore();
    const complaintsCollection = db.collection("complaints");
    const resp = await complaintsCollection.get();
    const complaints = resp.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(complaints);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = admin.firestore();
    const complaintsCollection = db.collection("complaints");
    const complaint = await complaintsCollection.doc(req.params.id).get();
    if (!complaint.exists) {
      res.status(404).send("Complaint not found");
    } else {
      res.status(200).send(complaint.data());
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const db = admin.firestore();
    const complaintsCollection = db.collection("complaints");
    const complaint = await complaintsCollection.doc(req.params.id).get();
    if (!complaint.exists) {
      res.status(404).send("Complaint not found");
    } else {
      await complaintsCollection.doc(req.params.id).delete();
      res.status(200).send("Complaint deleted successfully");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const db = admin.firestore();
    const complaintsCollection = db.collection("complaints");

    const complaint = await complaintsCollection.doc(req.params.id).get();
    if (!complaint.exists) {
      res.status(404).send("Complaint not found");
    } else {
      await complaintsCollection.doc(req.params.id).update({
        ...req.body,
        updateAt: new Date().toISOString(),
      });
      res.status(200).send("Complaint updated successfully");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
