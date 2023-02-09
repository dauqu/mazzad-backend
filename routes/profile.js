const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
  try {
    const db = admin.firestore();
    const profileCollection = db.collection("profile");
    const userId=req.body.user_id;

    //Add new profile to the collection
    profileCollection.add({
      user: userId,
      name: req.body.name,
      description: req.body.description,
      country: req.body.country,
      city: req.body.city,
      google_map: req.body.google_map,
      licence_number: req.body.licence_number,
      licence_doc: req.body.licence_doc,
      company_owner: req.body.company_owner,
      username: req.body.username,
      role: req.body.role,
      email: req.body.email,
      mobile: req.body.mobile,
      signature: req.body.stamp,
      stamp: req.body.stamp,
      createdAt: new Date().toISOString(),
    });

    //Send response
    res.status(200).send({
      message: "Profile added successfully",
    });
  } catch (error) {
    res.json({
      message: error.message,
      status: "error"
    })
  }
});

//Read all profiles
router.get("/", async (req, res) => {
  const db = admin.firestore();
  const profileCollection = db.collection("profile");
  const profile = await profileCollection.get();
  const profileArray = [];
  profile.forEach((doc) => {
    profileArray.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  res.status(200).send(profileArray);
});

//Read a profile
router.get("/:id", async (req, res) => {
  const db = admin.firestore();
  const profileCollection = db.collection("profile");
  const profile = await profileCollection.doc(req.params.id).get();
  if (!profile.exists) {
    res.status(404).send({
      message: "Profile not found",
    });
  } else {
    res.status(200).send({
      id: profile.id,
      ...profile.data()
    });
  }
});

//Update a profile
router.put("/:id", async (req, res) => {
  const db = admin.firestore();
  const profileCollection = db.collection("profile");
  const profile = await profileCollection.doc(req.params.id).get();
  if (!profile.exists) {
    res.status(404).send({
      message: "Profile not found",
    });
  } else {
    await profileCollection.doc(req.params.id).update({
      ...req.body
    });
    res.status(200).send({
      message: "Profile updated successfully",
    });
  }
});

//Delete a profile
router.delete("/:id", async (req, res) => {
  const db = admin.firestore();
  const profileCollection = db.collection("profile");
  const profile = await profileCollection.doc(req.params.id).get();
  if (!profile.exists) {
    res.status(404).send({
      message: "Profile not found",
    });
  } else {
    await profileCollection.doc(req.params.id).delete();
    res.status(200).send({
      message: "Profile deleted successfully",
    });
  }
});

//Get company profile
router.post("/company", async (req, res) => {
  const token =
    req.cookies.token || req.headers["x-access-token"] || req.body.token;

  //Verify token
  jwt.verify(token, "secret", async (err, decoded) => {
    if (err) {
      res.status(401).send({
        message: "Unauthorized",
      });
    } else {
      const db = admin.firestore();
      const companyCollection = db.collection("companies");

      //Get company by email
      const company = await companyCollection
        .where("email", "==", decoded.email)
        .get();
      if (company.empty) {
        res.status(404).send({
          message: "Company not found",
        });
      } else {
        const companies = company.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        res.status(200).send(companies);
      }
    }
  });
});

module.exports = router;
